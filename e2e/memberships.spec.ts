import { test, expect } from "@playwright/test"

test("GET /api/gyms/[id]/members requires auth", async ({ request }) => {
  const res = await request.get("/api/gyms/fake/members")
  expect(res.status()).toBe(401)
})

test("DELETE /api/gyms/[id]/members/[userId] requires auth", async ({ request }) => {
  const res = await request.delete("/api/gyms/fake/members/fake-user")
  expect(res.status()).toBe(401)
})

test("DELETE /api/memberships/me requires auth", async ({ request }) => {
  const res = await request.delete("/api/memberships/me?gymId=fake")
  expect(res.status()).toBe(401)
})

test("PATCH /api/gyms/[id]/members/[userId] requires auth", async ({ request }) => {
  const res = await request.patch("/api/gyms/fake/members/fake-user", {
    data: { role: "COACH" },
  })
  expect(res.status()).toBe(401)
})
