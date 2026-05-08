import { expect, type Page } from "@playwright/test";

// vim.wasm has to fetch + boot a multi-MB WebAssembly bundle. Headless CI is
// slow on a cold cache; give the editor a generous window to come up.
const EDITOR_READY_TIMEOUT = 60_000;

// Goal detection polls every ~750ms inside VimRunner; allow several poll cycles
// plus runtime jitter before declaring failure.
const GOAL_TIMEOUT = 20_000;

/**
 * Visit a lesson step that mounts a VimRunner and wait until the canvas-backed
 * editor reports "Editor ready". After this returns the runner is focusable
 * and accepts keystrokes.
 */
export async function openLessonAndWaitForEditor(
  page: Page,
  path: string,
): Promise<void> {
  await page.goto(path);
  const runner = page.locator(".vim-runner");
  await expect(runner).toBeVisible();
  await expect(runner.locator(".vim-status")).toHaveText(
    /Editor ready/i,
    { timeout: EDITOR_READY_TIMEOUT },
  );
}

/**
 * Click the runner's host element so vim-wasm focuses its hidden input. Without
 * this step keystrokes from page.keyboard go nowhere.
 */
export async function focusRunner(page: Page): Promise<void> {
  await page.locator(".vim-host").click();
}

/**
 * Wait for the VimRunner to mark its goal as reached. The component sets a
 * `vim-goal-reached` class on body and updates the status text once the buffer
 * matches the lesson's `.goal` file.
 */
export async function expectGoalReached(page: Page): Promise<void> {
  await expect(page.locator("body")).toHaveClass(
    /vim-goal-reached/,
    { timeout: GOAL_TIMEOUT },
  );
  await expect(page.locator(".vim-status.goal-reached")).toBeVisible();
}
