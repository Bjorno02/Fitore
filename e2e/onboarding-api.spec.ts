import { test, expect } from "@playwright/test"

test("POST /api/gyms requires auth", async ({ request }) => {
  const res = await request.post("/api/gyms", { data: { name: "Test Gym" } })
  expect(res.status()).toBe(401)
})

test("GET /api/gyms requires auth", async ({ request }) => {
  const res = await request.get("/api/gyms?search=test")
  expect(res.status()).toBe(401)
})

test("POST /api/gyms/[id]/requests requires auth", async ({ request }) => {
  const res = await request.post("/api/gyms/nonexistent/requests")
  expect(res.status()).toBe(401)
})

test("GET /api/gyms/[id]/requests requires auth", async ({ request }) => {
  const res = await request.get("/api/gyms/nonexistent/requests")
  expect(res.status()).toBe(401)
})

test("PATCH /api/gyms/[id]/requests/[userId] requires auth", async ({ request }) => {
  const res = await request.patch("/api/gyms/nonexistent/requests/nonexistent-user", {
    data: { action: "approve" },
  })
  expect(res.status()).toBe(401)
})
