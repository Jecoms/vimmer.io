import { test, expect } from "@playwright/test";
import { openLessonAndWaitForEditor } from "./helpers";

test.describe("VimRunner load", () => {
  test("editor mounts with a canvas and reports ready", async ({ page }) => {
    await openLessonAndWaitForEditor(page, "/lessons/04-basic-editing/2");

    const canvas = page.locator(".vim-canvas");
    await expect(canvas).toBeVisible();
    const dims = await canvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));
    expect(dims.width).toBeGreaterThan(0);
    expect(dims.height).toBeGreaterThan(0);
  });

  test("reset button restores the start buffer", async ({ page }) => {
    await openLessonAndWaitForEditor(page, "/lessons/04-basic-editing/2");
    await page.locator(".vim-host").click();

    // Modify the buffer so reset has something to undo.
    await page.keyboard.press("d");
    await page.keyboard.press("d");

    await page.locator(".vim-reset").click();
    await expect(page.locator(".vim-status")).toHaveText(/reset to start/i, {
      timeout: 10_000,
    });
  });
});
