import { test, expect } from "@playwright/test";
import fs from "node:fs";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pt_ga_consent", "denied");
    localStorage.setItem(
      "sppu_profile",
      JSON.stringify({
        name: "Aarya",
        setupComplete: true,
        selectedSubjects: ["m1", "phy"],
        theme: "dark",
      }),
    );
    localStorage.setItem(
      "sppu_tasks",
      JSON.stringify([
        {
          id: "keep",
          text: "Keep my task",
          completed: false,
          createdAt: "2026-10-27",
        },
      ]),
    );
  });
});
test("sample tour highlights real controls, traps focus, restores access and leaves study data untouched", async ({
  page,
}) => {
  await page.goto("/app?tour=sample");
  await expect(
    page.getByRole("dialog", { name: "A little direction. Then you are off." }),
  ).toBeVisible();
  const before = await page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage).filter(
          ([k]) => k.startsWith("sppu_") && k !== "sppu_announcements_cache",
        ),
      ),
    ),
  );
  await expect(page.locator("[data-tour=shell]")).toHaveAttribute("inert", "");
  await page.getByRole("button", { name: "Show me around" }).click();
  for (let i = 1; i < 4; i++) {
    const spotlight = page.locator(`.pt-tour-spotlight[data-step="${i}"]`);
    await expect(spotlight).toBeVisible();
    const overlaps = () =>
      page.evaluate(() => {
        const a = document
          .querySelector(".pt-tour-spotlight")!
          .getBoundingClientRect();
        const b = document
          .querySelector(".pt-tour-card")!
          .getBoundingClientRect();
        return !(
          a.right <= b.left ||
          a.left >= b.right ||
          a.bottom <= b.top ||
          a.top >= b.bottom
        );
      });
    await expect.poll(overlaps).toBeFalsy();
    if (i < 3)
      await page.getByRole("button", { name: "Next", exact: true }).click();
  }
  await page.getByRole("button", { name: "Start studying" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-tour=shell]")).not.toHaveAttribute(
    "inert",
    "",
  );
  const after = await page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage).filter(
          ([k]) => k.startsWith("sppu_") && k !== "sppu_announcements_cache",
        ),
      ),
    ),
  );
  expect(after).toEqual(before);
});
test("sample supports Escape, reduced motion and accessible dialog", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/app?tour=sample");
  await page.getByRole("dialog").waitFor();
  await page.addScriptTag({
    content: fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8"),
  });
  const errors = await page.evaluate(async () =>
    (
      await (window as any).axe.run(document.querySelector(".pt-tour"), {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      })
    ).violations.map((v: any) => v.id),
  );
  expect(errors).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: /Study/ }).first(),
  ).toBeVisible();
  await expect(page.locator(".pt-tour")).toHaveCount(0);
});
