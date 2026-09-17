import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { resolve, join } from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath, pathToFileURL } from "node:url"
import { checkMigrationHistory } from "./migration-history.mjs"

export function localDatabase(env) {
  const url = new URL(env.DATABASE_URL)
  assert(["postgres:", "postgresql:"].includes(url.protocol))
  assert(["localhost", "127.0.0.1"].includes(url.hostname)
    && url.pathname === "/migration_compatibility",
  "Compatibility tests only accept a local database named migration_compatibility")
  assert(!url.search, "Database URL overrides are not allowed for compatibility tests")
}

function run(command, args, cwd, env) {
  return new Promise((accept, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: "inherit" })
    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) accept()
      else reject(new Error(`${command} ${args.join(" ")} failed (${signal ?? code})`))
    })
  })
}

export async function exerciseApp(baseURL, label, preserved = [], write = true) {
  async function request(path, role = "coach", body, status = 200) {
    const response = await fetch(`${baseURL}${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        cookie: `authjs.session-token=compat-${role}-token`,
        "content-type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    })
    assert.equal(response.status, status, `${label}: ${path} must return ${status}`)
    return response
  }

  const sessions = await (await request("/api/sessions?gymId=compat-gym")).json()
  for (const expected of [{ id: "compat-existing-session", duration: 60, intensity: 5, type: "drilling" }, ...preserved]) {
    const record = sessions.find((row) => row.id === expected.id)
    assert(record, `${label}: existing session ${expected.id} disappeared`)
    for (const key of ["duration", "intensity", "type"]) {
      assert.equal(record[key], expected[key], `${label}: session ${expected.id}.${key} changed`)
    }
    assert.equal(record.userId, "compat-athlete")
    assert.equal(record.gymId, "compat-gym")
  }
  const checkins = await (await request("/api/checkins?gymId=compat-gym")).json()
  const existing = checkins.find((row) => row.id === "compat-existing-checkin")
  assert(existing, `${label}: existing check-in disappeared`)
  assert.deepEqual([existing.sleep, existing.soreness, existing.injury, existing.stress], [7, 3, false, 2])

  const members = await (await request("/api/gyms/compat-gym/members")).json()
  assert.deepEqual(members.map((member) => [member.userId, member.role]).sort(),
    [["compat-athlete", "ATHLETE"], ["compat-coach", "COACH"]])
  const day = new Date().toISOString().slice(0, 10)
  const dashboard = await (await request(`/api/dashboard/day?gymId=compat-gym&date=${day}`)).json()
  const athlete = dashboard.find((row) => row.userId === "compat-athlete")
  assert(athlete?.sessions.some((session) => session.duration === 60), `${label}: dashboard lost training history`)

  const payload = { gymId: "compat-gym", duration: 45, intensity: 6, type: "drilling" }
  await request("/api/sessions", "pending", payload, 403)
  await request("/api/sessions", "athlete", { ...payload, gymId: "compat-other-gym" }, 403)
  await request("/athlete/history", "athlete")

  let created
  if (write) {
    created = await (await request("/api/sessions", "athlete", payload)).json()
    assert(created.id, `${label}: training session was not created`)
    const saved = await (await request("/api/sessions?gymId=compat-gym")).json()
    assert(saved.some((row) => row.id === created.id && row.duration === 45), `${label}: new session cannot be read back`)
    const checkin = await (await request("/api/checkins", "athlete", {
      gymId: "compat-gym", sleep: 8, soreness: 2, injury: false, stress: 3,
    })).json()
    const savedCheckins = await (await request("/api/checkins?gymId=compat-gym")).json()
    assert(savedCheckins.some((row) => row.id === checkin.id && row.sleep === 8), `${label}: new check-in cannot be read back`)
  }
  console.log(`Passed: ${label}`)
  return created
}

export async function startApp(root, port, env) {
  const baseURL = `http://127.0.0.1:${port}`
  const child = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root, env: { ...env, AUTH_URL: baseURL, NEXTAUTH_URL: baseURL }, stdio: "inherit",
  })
  let startError
  child.once("error", (error) => { startError = error })
  async function stop() {
    if (child.exitCode !== null || child.signalCode !== null || startError) return
    const exited = once(child, "exit")
    child.kill("SIGTERM")
    const timer = setTimeout(() => child.kill("SIGKILL"), 5_000)
    try { await exited } finally { clearTimeout(timer) }
  }
  try {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (startError) throw startError
      assert(child.exitCode === null && child.signalCode === null, `App exited before becoming ready: ${root}`)
      try {
        const response = await fetch(`${baseURL}/login`, { signal: AbortSignal.timeout(1_000) })
        if (response.status === 200) return { baseURL, stop }
      } catch { /* Wait for the local server to bind. */ }
      await delay(1_000)
    }
    throw new Error(`App did not become ready: ${root}`)
  } catch (error) {
    await stop()
    throw error
  }
}

export async function compatibility(baseline, candidate, environment = process.env) {
  localDatabase(environment)
  const env = {
    ...environment, CI: "true", NEXT_TELEMETRY_DISABLED: "1",
    AUTH_SECRET: "compatibility-test-only-secret", NEXTAUTH_SECRET: "compatibility-test-only-secret",
    AUTH_TRUST_HOST: "true", AUTH_GOOGLE_ID: "compatibility", AUTH_GOOGLE_SECRET: "compatibility",
    SENTRY_AUTH_TOKEN: "", NEXT_PUBLIC_SENTRY_DSN: "",
    UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "",
  }
  const added = await checkMigrationHistory(baseline, candidate)
  console.log(`Testing ${added.length} new migration(s): ${added.join(", ") || "none"}`)
  const prisma = (root) => join(root, "node_modules/prisma/build/index.js")
  await run(process.execPath, [prisma(baseline), "migrate", "deploy"], baseline, env)
  await run("psql", ["--no-psqlrc", env.DATABASE_URL, "--set=ON_ERROR_STOP=1", "--file", fileURLToPath(new URL("migration-fixture.sql", import.meta.url))], baseline, env)
  await run("npm", ["run", "build"], baseline, env)
  const oldApp = await startApp(baseline, 3101, env)
  let newApp
  try {
    const before = await exerciseApp(oldApp.baseURL, "deployed app / original schema")
    await run(process.execPath, [prisma(candidate), "migrate", "deploy"], candidate, env)
    const after = await exerciseApp(oldApp.baseURL, "deployed app / upgraded schema", [before])
    await run("npm", ["run", "build"], candidate, env)
    newApp = await startApp(candidate, 3102, env)
    const next = await exerciseApp(newApp.baseURL, "candidate app / upgraded schema", [before, after])
    await exerciseApp(oldApp.baseURL, "deployed app / candidate-written data", [before, after, next], false)
  } finally {
    await newApp?.stop()
    await oldApp.stop()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assert(process.argv[2] && process.argv[3], "Usage: node migration-compatibility.mjs <deployed-checkout> <candidate-checkout>")
  await compatibility(resolve(process.argv[2]), resolve(process.argv[3]))
}
