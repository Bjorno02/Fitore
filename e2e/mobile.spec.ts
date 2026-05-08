import { test, expect } from "@playwright/test"

test.use({ viewport: { width: 375, height: 812 } })

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflowing = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  )
  expect(overflowing, "page should not overflow horizontally at 375px").toBe(false)
}

test("login page has no horizontal overflow at 375px", async ({ page }) => {
  await page.goto("/login")
  await expectNoHorizontalOverflow(page)
})

test("gated route redirects to login at mobile viewport without overflow", async ({ page }) => {
  await page.goto("/athlete")
  await expect(page).toHaveURL(/\/login/)
  await expectNoHorizontalOverflow(page)
})

test("login sign-in button meets touch-target floor", async ({ page }) => {
  await page.goto("/login")
  const button = page.getByRole("button", { name: /continue with google/i })
  await expect(button).toBeVisible()
  const box = await button.boundingBox()
  expect(box, "sign-in button should have a layout box").not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})
