import assert from "node:assert/strict"
import { appendFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

export async function productionBaseline(env = process.env, request = fetch) {
  for (const name of ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID", "PRODUCTION_DOMAIN"]) {
    assert(env[name], `${name} is required to resolve the deployed release`)
  }
  assert(/^[a-z0-9.-]+$/i.test(env.PRODUCTION_DOMAIN), "PRODUCTION_DOMAIN must be a hostname")

  async function get(path, params = {}) {
    const url = new URL(path, "https://api.vercel.com")
    url.search = new URLSearchParams({ teamId: env.VERCEL_ORG_ID, ...params }).toString()
    const response = await request(url, {
      headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    })
    // Deployment responses can contain secrets; never log their bodies.
    assert(response.ok, `Vercel baseline lookup failed: HTTP ${response.status}`)
    return response.json()
  }

  const alias = await get(`/v4/aliases/${encodeURIComponent(env.PRODUCTION_DOMAIN)}`, {
    projectId: env.VERCEL_PROJECT_ID,
  })
  assert.equal(alias.projectId, env.VERCEL_PROJECT_ID, "Production alias belongs to another project")
  assert(!alias.redirect, "Production alias is a redirect, not a deployment")
  const id = alias.deploymentId
  assert(typeof id === "string" && /^dpl_[a-zA-Z0-9]+$/.test(id), "Production alias has no deployment ID")

  const deployment = await get(`/v13/deployments/${id}`, { withGitRepoInfo: "true" })
  assert.equal(deployment.id, id)
  assert.equal(deployment.readyState, "READY", "The deployed baseline is not ready")
  const sha = deployment.meta?.pipelineCommitSha ?? deployment.meta?.githubCommitSha ?? deployment.gitSource?.sha
  assert(typeof sha === "string" && /^[a-f0-9]{40}$/i.test(sha),
    "Production deployment has no full Git SHA. Establish its source commit before enabling migrations; never substitute main or HEAD~1.")

  if (env.EXPECTED_DEPLOYMENT_ID) {
    assert.equal(id, env.EXPECTED_DEPLOYMENT_ID, "Production changed during this run; rerun the complete pipeline")
    assert.equal(sha, env.EXPECTED_DEPLOYMENT_SHA, "Production source changed during this run")
  }
  return { id, sha }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const baseline = await productionBaseline()
  console.log(`Production baseline: ${baseline.id} at ${baseline.sha}`)
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `id=${baseline.id}\nsha=${baseline.sha}\n`)
  }
}
