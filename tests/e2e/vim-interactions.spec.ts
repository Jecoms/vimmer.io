import { test } from "@playwright/test";
import {
  openLessonAndWaitForEditor,
  focusRunner,
  expectGoalReached,
} from "./helpers";

// Each test drives an existing lesson page through a real keystroke sequence
// and asserts that VimRunner reports `goal-reached`. The component compares
// the live buffer against the lesson's `.goal` file every ~750ms; reaching
// the goal proves the keystrokes were captured and the relevant Vim mode /
// command worked end-to-end.

test.describe("Vim interactions", () => {
  test("keystroke capture: yy + 5p reaches the yank/put goal", async ({ page }) => {
    // lessons/06-copying-and-pasting/2 expects line 3 to be duplicated 5x.
    await openLessonAndWaitForEditor(page, "/lessons/06-copying-and-pasting/2");
    await focusRunner(page);

    // 3G → jump to line 3 (the source line). yy → yank it. 5p → put 5 copies.
    await page.keyboard.type("3Gyy5p");

    await expectGoalReached(page);
  });

  test("visual mode: V + d deletes lines via visual-line selection", async ({ page }) => {
    // lessons/04-basic-editing/3 has alternating DELETE ME / KEEP ME lines;
    // goal keeps only the two KEEP ME lines.
    await openLessonAndWaitForEditor(page, "/lessons/04-basic-editing/3");
    await focusRunner(page);

    // Layout: D K D D K D (D = DELETE ME, K = KEEP ME). Cursor starts on line 1.
    //   Vd          delete line 1 (D)            → K D D K D
    //   jVjd        skip 1, select 2, delete     → K K D
    //   jVd         skip 1, delete last D        → K K
    await page.keyboard.type("V");
    await page.keyboard.press("d");
    await page.keyboard.type("jVj");
    await page.keyboard.press("d");
    await page.keyboard.type("jV");
    await page.keyboard.press("d");

    await expectGoalReached(page);
  });

  test("insert mode: O + Esc enters/leaves insert without breaking later commands", async ({ page }) => {
    await openLessonAndWaitForEditor(page, "/lessons/06-copying-and-pasting/2");
    await focusRunner(page);

    // Use insert mode first, undo it, then complete the goal. If insert-mode
    // keystrokes weren't captured the surrounding commands would land on the
    // wrong buffer state and the goal would never be reached.
    //   3G            cursor to source line
    //   Ohello<Esc>   open line above + insert "hello" + leave insert mode
    //   dd            delete the inserted line (back to original buffer)
    //   yy5p          complete the lesson goal
    await page.keyboard.type("3GO");
    await page.keyboard.type("hello");
    await page.keyboard.press("Escape");
    await page.keyboard.type("ddyy5p");

    await expectGoalReached(page);
  });

  test("search/replace: :%s substitution collapses extra whitespace", async ({ page }) => {
    // lessons/04-basic-editing/2 starts with paragraphs containing runs of
    // multiple spaces; the goal collapses those to single spaces.
    await openLessonAndWaitForEditor(page, "/lessons/04-basic-editing/2");
    await focusRunner(page);

    // :%s/  \+/ /g  — replace any run of 2+ spaces with one space, every line.
    await page.keyboard.type(":%s/  \\+/ /g");
    await page.keyboard.press("Enter");

    await expectGoalReached(page);
  });
});
