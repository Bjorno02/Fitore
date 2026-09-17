import assert from "node:assert/strict"
import { appendFile, readdir, readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

export async function checkMigrationHistory(baseline, candidate) {
  const paths = [baseline, candidate].map((root) => join(root, "prisma/migrations"))
  const [oldNames, newNames] = await Promise.all(paths.map(async (path) =>
    (await readdir(path, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort(),
  ))
  assert(oldNames.length > 0, "The deployed release has no migration history")
  assert.deepEqual(newNames.slice(0, oldNames.length), oldNames,
    "Candidate migrations must preserve the deployed history and append new migrations in order")
  for (const name of ["migration_lock.toml", ...oldNames.map((name) => `${name}/migration.sql`)]) {
    const [before, after] = await Promise.all(paths.map((path) => readFile(join(path, name), "utf8")))
    assert.equal(after, before, `Applied migration history was edited: ${name}`)
  }
  return newNames.slice(oldNames.length)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const added = await checkMigrationHistory(resolve(process.argv[2]), resolve(process.argv[3]))
  console.log(`New migrations: ${added.join(", ") || "none"}`)
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `added=${added.length}\n`)
}
