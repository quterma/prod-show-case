import { test, expect } from "@playwright/test"

test("homepage should load", async ({ page }) => {
  await page.goto("/")

  // Проверяем, что страница загрузилась
  await expect(page).toHaveTitle(/prod-show-case/)

  // Проверяем наличие основного контента
  await expect(page.locator("h1")).toBeVisible()
})

test("navigation should work", async ({ page }) => {
  await page.goto("/")

  // Проверяем базовую навигацию
  const heading = page.locator("h1")
  await expect(heading).toBeVisible()

  // Можно добавить проверки на клики по ссылкам, когда они появятся
})
