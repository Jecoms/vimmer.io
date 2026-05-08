import { test, expect } from "@playwright/test";

test.describe("static pages", () => {
  test("home page renders and links to lessons + tips", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/vimmer\.io/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Learn Vim/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /lessons/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /tips/i }).first()).toBeVisible();
  });

  test("lessons index lists lessons and links into step 1", async ({ page }) => {
    await page.goto("/lessons");
    await expect(page.getByRole("heading", { level: 1, name: "Lessons" })).toBeVisible();
    const items = page.locator("ul.lesson-list > li");
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(5);

    // Click the "Basic editing" lesson to verify routing into a step page.
    await page.getByRole("link", { name: /Basic Editing/i }).click();
    await expect(page).toHaveURL(/\/lessons\/04-basic-editing\/1$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Basic Editing/i }),
    ).toBeVisible();
  });

  test("tips index lists tips and a tip page renders content", async ({ page }) => {
    await page.goto("/tips");
    await expect(page.getByRole("heading", { level: 1, name: "Tips" })).toBeVisible();
    const items = page.locator("ul.tip-list > li");
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(5);

    await page.goto("/tips/smile");
    await expect(
      page.getByRole("heading", { level: 1, name: /Smile/i }),
    ).toBeVisible();
    // Body of the smile tip mentions the :smile command.
    await expect(page.getByText(":smile").first()).toBeVisible();
  });

  test("lesson step navigation: prev/next links thread between steps", async ({ page }) => {
    await page.goto("/lessons/04-basic-editing/2");
    await expect(page.getByText(/Step 2 of/)).toBeVisible();
    await page.getByRole("link", { name: /Step 3/ }).click();
    await expect(page).toHaveURL(/\/lessons\/04-basic-editing\/3$/);
    await expect(page.getByText(/Step 3 of/)).toBeVisible();
    await page.getByRole("link", { name: /Step 2/ }).click();
    await expect(page).toHaveURL(/\/lessons\/04-basic-editing\/2$/);
  });
});
