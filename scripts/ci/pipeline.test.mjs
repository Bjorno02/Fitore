import assert from "node:assert/strict"
import { test } from "node:test"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { productionBaseline } from "./production-baseline.mjs"
import { checkMigrationHistory } from "./migration-history.mjs"
import { localDatabase } from "./migration-compatibility.mjs"

const sha = "a".repeat(40)
const config = {
  VERCEL_TOKEN: "test-token", VERCEL_ORG_ID: "team_test",
  VERCEL_PROJECT_ID: "prj_test", PRODUCTION_DOMAIN: "fitore.vercel.app",
}

function vercel({ alias = {}, deployment = {} } = {}) {
  return async (url, options) => {
    assert.equal(url.origin, "https://api.vercel.com")
    assert.equal(url.searchParams.get("teamId"), "team_test")
    assert.equal(options.headers.Authorization, "Bearer test-token")
    const value = url.pathname.startsWith("/v4/aliases/")
      ? { projectId: "prj_test", deploymentId: "dpl_live", ...alias }
      : { id: "dpl_live", readyState: "READY", meta: { pipelineCommitSha: sha }, ...deployment }
    return { ok: true, json: async () => value }
  }
}

test("resolves the domain's deployment, including an older rolled-back SHA", async () => {
  assert.deepEqual(await productionBaseline(config, vercel()), { id: "dpl_live", sha })
})

test("supports existing Git metadata before pipelineCommitSha was introduced", async () => {
  assert.equal((await productionBaseline(config, vercel({ deployment: { meta: { githubCommitSha: sha } } }))).sha, sha)
  assert.equal((await productionBaseline(config, vercel({ deployment: { meta: {}, gitSource: { sha } } }))).sha, sha)
})

test("fails closed on missing, abbreviated, or unsafe source SHAs", async () => {
  for (const value of [undefined, "main", "123abcd", `${sha}\nsha=other`]) {
    await assert.rejects(productionBaseline(config, vercel({ deployment: { meta: { pipelineCommitSha: value } } })), /no full Git SHA/)
  }
})

test("rejects a different project, redirect, missing deployment, or unready app", async () => {
  for (const alias of [{ projectId: "prj_other" }, { redirect: "https://other.invalid" }, { deploymentId: null }]) {
    await assert.rejects(productionBaseline(config, vercel({ alias })))
  }
  await assert.rejects(productionBaseline(config, vercel({ deployment: { readyState: "ERROR" } })))
})

test("stops when production moves after the compatibility test", async () => {
  await assert.rejects(productionBaseline({ ...config, EXPECTED_DEPLOYMENT_ID: "dpl_previous", EXPECTED_DEPLOYMENT_SHA: sha }, vercel()), /Production changed/)
  await assert.rejects(productionBaseline({ ...config, EXPECTED_DEPLOYMENT_ID: "dpl_live", EXPECTED_DEPLOYMENT_SHA: "b".repeat(40) }, vercel()), /Production source changed/)
})

test("API failure does not leak the response body", async () => {
  await assert.rejects(productionBaseline(config, async () => ({
    ok: false, status: 403, json: () => { throw new Error("must not read secrets") },
  })), /HTTP 403/)
})

test("compatibility fixture refuses non-local and non-dedicated databases", () => {
  localDatabase({ DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/migration_compatibility" })
  for (const url of ["postgresql://user@production.example/migration_compatibility", "postgresql://user@localhost/postgres", "postgresql://user@localhost/migration_compatibility?host=production.example", "https://localhost/migration_compatibility"]) {
    assert.throws(() => localDatabase({ DATABASE_URL: url }))
  }
})

test("deployed migration files are immutable and new migrations must be appended", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "pipeline-history-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  const oldRoot = join(root, "old")
  const newRoot = join(root, "new")
  async function migration(base, name, sql = "SELECT 1;") {
    const path = join(base, "prisma/migrations", name)
    await mkdir(path, { recursive: true })
    await writeFile(join(path, "migration.sql"), sql)
  }
  for (const base of [oldRoot, newRoot]) {
    await migration(base, "20260901000000_init")
    await writeFile(join(base, "prisma/migrations/migration_lock.toml"), 'provider = "postgresql"\n')
  }
  assert.deepEqual(await checkMigrationHistory(oldRoot, newRoot), [])
  await migration(newRoot, "20260917000000_expand")
  assert.deepEqual(await checkMigrationHistory(oldRoot, newRoot), ["20260917000000_expand"])
  await migration(newRoot, "20260901000000_init", "SELECT 2;")
  await assert.rejects(checkMigrationHistory(oldRoot, newRoot), /history was edited/)
  await migration(newRoot, "20260901000000_init")
  await migration(newRoot, "20260801000000_out_of_order")
  await assert.rejects(checkMigrationHistory(oldRoot, newRoot), /append new migrations/)
})
