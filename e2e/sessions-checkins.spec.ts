import { test, expect } from "@playwright/test"

test("DELETE /api/sessions/[id] requires auth", async ({ request }) => {
  const res = await request.delete("/api/sessions/fake-id")
  expect(res.status()).toBe(401)
})

test("PATCH /api/sessions/[id] requires auth", async ({ request }) => {
  const res = await request.patch("/api/sessions/fake-id", {
    data: { duration: 60 },
  })
  expect(res.status()).toBe(401)
})

test("DELETE /api/checkins/[id] requires auth", async ({ request }) => {
  const res = await request.delete("/api/checkins/fake-id")
  expect(res.status()).toBe(401)
})

test("PATCH /api/checkins/[id] requires auth", async ({ request }) => {
  const res = await request.patch("/api/checkins/fake-id", {
    data: { sleep: 8 },
  })
  expect(res.status()).toBe(401)
})
