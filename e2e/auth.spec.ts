import { test, expect } from "@playwright/test"

test("unauthenticated user is redirected to sign in", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/api\/auth\/signin/)
})

test("unauthenticated user cannot access athlete page", async ({ page }) => {
  await page.goto("/athlete")
  await expect(page).toHaveURL(/api\/auth\/signin/)
})

test("API returns 401 without session", async ({ request }) => {
  const res = await request.post("/api/sessions", {
    data: { gymId: "any", duration: 60, intensity: 5, type: "drilling" },
  })
  expect(res.status()).toBe(401)
})

test("unauthenticated user cannot access athlete history page", async ({ page }) => {
  await page.goto("/athlete/history")
  await expect(page).toHaveURL(/api\/auth\/signin/)
})
