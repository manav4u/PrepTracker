import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { GUIDE_CHAPTERS } from "../lib/guide";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pt_ga_consent", "denied"),
  );
});
test("guide works before setup, searches, and keeps reader state out of study data", async ({
  page,
}) => {
  await page.goto("/guide");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Less figuring",
  );
  await expect(page.locator(".guide-card")).toHaveCount(11);
  const before = await page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage).filter(([k]) => k.startsWith("sppu_")),
      ),
    ),
  );
  await page.getByRole("textbox", { name: "Search the guide" }).fill("backup");
  await expect(page.getByRole("status")).not.toHaveText("0 chapters found");
  await page
    .getByRole("textbox", { name: "Search the guide" })
    .fill("zzzz-no-match");
  await expect(
    page.getByRole("heading", { name: "No chapter by that name." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all chapters" }).click();
  await page
    .locator(".guide-card")
    .filter({ hasText: "Know what to study today." })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Daily plan",
  );
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    "Open Revise, then Plan.",
  );
  await page
    .getByRole("button", { name: "Enlarge example screenshot" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Enlarge example screenshot" }),
  ).toBeFocused();
  expect(
    await page.evaluate(() =>
      JSON.stringify(
        Object.fromEntries(
          Object.entries(localStorage).filter(([k]) => k.startsWith("sppu_")),
        ),
      ),
    ),
  ).toEqual(before);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Give each subject its own date.",
      exact: true,
    }),
  ).toBeVisible();
});
test("every chapter and step has a working visual and no overflow", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const chapter of GUIDE_CHAPTERS) {
    await page.goto("/guide/" + chapter.id);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      chapter.id === "daily-plan" ? "Daily plan" : chapter.title,
    );
    for (let i = 0; i < chapter.steps.length; i++) {
      await page.locator(".guide-step-nav button").nth(i).click();
      await expect(page.getByRole("heading", { level: 2 })).toHaveText(
        chapter.steps[i].title,
      );
      if (chapter.steps[i].image)
        await expect
          .poll(() =>
            page
              .locator(".guide-image-button img")
              .evaluate(
                (i: HTMLImageElement) => i.complete && i.naturalWidth > 0,
              ),
          )
          .toBeTruthy();
      else await expect(page.locator(".guide-diagram")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
    }
    if (process.env.GUIDE_SHOTS) {
      fs.mkdirSync("/tmp/guide-proof", { recursive: true });
      await page.locator(".guide-step-nav button").first().click();
      await page.screenshot({
        path: `/tmp/guide-proof/${chapter.id}-${info.project.name}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});
test("guide passes axe and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const axe = fs.readFileSync(
    path.resolve("node_modules/axe-core/axe.min.js"),
    "utf8",
  );
  for (const route of [
    "/guide",
    "/guide/daily-plan",
    "/guide/backup-restore",
  ]) {
    await page.goto(route);
    await page.locator("h1").waitFor();
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () =>
      (
        await (window as any).axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        })
      ).violations.map((v: any) => ({
        id: v.id,
        nodes: v.nodes.map((n: any) => n.target),
      })),
    );
    expect(violations).toEqual([]);
  }
});

test("guide preserves existing study records and links from Settings", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("seeded-guide-preservation")) return;
    localStorage.setItem(
      "sppu_profile",
      JSON.stringify({
        name: "Synthetic",
        theme: "dark",
        selectedSubjects: ["m1"],
        setupComplete: true,
        streak: 1,
        lastStudyDate: "",
        prn: "DEMO",
        examDates: { m1: "2026-11-05" },
        unknownFutureField: "keep",
      }),
    );
    localStorage.setItem(
      "sppu_progress",
      JSON.stringify([
        {
          unitId: "m1-u1",
          status: "In Progress",
          pyqsCompleted: ["2023"],
          topicsDone: ["Rolle’s Theorem"],
        },
      ]),
    );
    localStorage.setItem(
      "sppu_tasks",
      JSON.stringify([
        {
          id: "demo",
          text: "Keep my task",
          completed: false,
          priority: "NORMAL",
          category: "GENERAL",
          createdAt: "2026-10-27",
          subjectId: "m1",
        },
      ]),
    );
    sessionStorage.setItem("seeded-guide-preservation", "yes");
  });
  await page.goto("/app/settings");
  await page.getByRole("heading", { level: 1 }).waitFor();
  const before = await page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) =>
        [
          "sppu_profile",
          "sppu_progress",
          "sppu_tasks",
          "sppu_reviews",
          "sppu_calculator_marks",
          "sppu_custom_resources",
          "sppu_deleted_system_ids",
        ].includes(k),
      ),
    ),
  );
  await page.getByRole("link", { name: /The PrepTracker guide/ }).click();
  await page
    .locator(".guide-card")
    .filter({ hasText: "Keep a copy you can trust." })
    .click();
  await page.locator(".guide-step-nav button").nth(2).click();
  await page
    .getByRole("button", { name: "Enlarge example screenshot" })
    .click();
  await page.keyboard.press("Escape");
  const after = await page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) =>
        [
          "sppu_profile",
          "sppu_progress",
          "sppu_tasks",
          "sppu_reviews",
          "sppu_calculator_marks",
          "sppu_custom_resources",
          "sppu_deleted_system_ids",
        ].includes(k),
      ),
    ),
  );
  expect(after).toEqual(before);
});

test("Daily Plan sample keeps details available and bottom controls clear", async ({
  page,
}, info) => {
  await page.goto("/guide/daily-plan");
  await expect(page.locator(".v2-active h2")).toBeVisible();
  const details = page.locator(".v2-details");
  if (info.project.name === "mobile") {
    await expect(details).not.toHaveAttribute("open", "");
    await details.locator("summary").click();
  } else await expect(details).toHaveAttribute("open", "");
  await expect(details).toContainText(
    "No date? That subject stays outside Plan.",
  );
  await details.locator("small").scrollIntoViewIfNeeded();
  const clearance = await page.evaluate(() => {
    const last = document
      .querySelector(".v2-details small")!
      .getBoundingClientRect();
    const bar = document.querySelector(".v2-controls")!.getBoundingClientRect();
    return last.bottom <= bar.top;
  });
  expect(clearance).toBeTruthy();
  for (let i = 0; i < 4; i++) {
    await page.locator(".v2-progress button").nth(i).click();
    await expect(page.locator(".v2-progress button").nth(i)).toHaveAttribute(
      "aria-current",
      "step",
    );
    await expect(page.locator(".v2-active h2")).toBeVisible();
  }
  await expect(page.locator(".v2-finish")).toBeVisible();
  await expect(page.locator(".v2-controls a")).toHaveText("Open Plan");
});
