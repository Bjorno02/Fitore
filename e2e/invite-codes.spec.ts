import { test, expect } from "@playwright/test"

test("POST /api/invite-codes requires auth", async ({ request }) => {
  const res = await request.post("/api/invite-codes", {
    data: { gymId: "fake", role: "ATHLETE" },
  })
  expect(res.status()).toBe(401)
})

test("GET /api/invite-codes requires auth", async ({ request }) => {
  const res = await request.get("/api/invite-codes?gymId=fake")
  expect(res.status()).toBe(401)
})

test("DELETE /api/invite-codes/[id] requires auth", async ({ request }) => {
  const res = await request.delete("/api/invite-codes/fake-id")
  expect(res.status()).toBe(401)
})

test("POST /api/invite-codes/redeem requires auth", async ({ request }) => {
  const res = await request.post("/api/invite-codes/redeem", {
    data: { code: "abcd-1234" },
  })
  expect(res.status()).toBe(401)
})
