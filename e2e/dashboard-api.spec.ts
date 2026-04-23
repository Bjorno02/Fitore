import { test, expect } from "@playwright/test"

test("GET /api/dashboard/day requires auth", async ({ request }) => {
  const res = await request.get("/api/dashboard/day?gymId=fake&date=2026-04-08")
  expect(res.status()).toBe(401)
})

test("GET /api/dashboard/summary requires auth", async ({ request }) => {
  const res = await request.get("/api/dashboard/summary?gymId=fake&month=2026-04")
  expect(res.status()).toBe(401)
})
