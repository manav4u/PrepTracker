import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { TOURS, TOUR_VERSION, type TourId } from "../lib/tours";
const paths: Record<TourId, string> = {
  home: "/app",
  library: "/app/resources",
  tasks: "/app/tasks",
  review: "/app/revise",
  plan: "/app/revise?tab=plan",
  settings: "/app/settings",
  course: "/app/subject/m1",
};
async function seed(page: any, populated = false) {
  await page.addInitScript(
    ({ populated, version }: any) => {
      if (sessionStorage.getItem("tour-fixture")) return;
      sessionStorage.setItem("tour-fixture", "yes");
      localStorage.setItem("pt_ga_consent", "denied");
      localStorage.setItem(version, JSON.stringify({ prompts: "off" }));
      localStorage.setItem(
        "sppu_profile",
        JSON.stringify({
          name: "Aarya",
          setupComplete: true,
          selectedSubjects: ["m1", "phy"],
          theme: "dark",
          examDates: populated ? { m1: "2026-11-05", phy: "2026-11-08" } : {},
        }),
      );
      if (populated) {
        localStorage.setItem(
          "sppu_tasks",
          JSON.stringify([
            {
              id: "keep",
              text: "Keep my task",
              completed: false,
              createdAt: "2026-10-20",
              dueDate: "2026-10-20",
              priority: "NORMAL",
              category: "GENERAL",
            },
          ]),
        );
        localStorage.setItem(
          "sppu_progress",
          JSON.stringify([
            {
              unitId: "m1-u1",
              status: "In Progress",
              topicsDone: ["Rolle’s Theorem"],
              pyqsCompleted: [],
            },
          ]),
        );
        localStorage.setItem(
          "sppu_reviews",
          JSON.stringify({
            "m1-u1::Rolle’s Theorem": {
              stage: 0,
              due: "2026-10-01",
              last: "2026-09-28",
            },
          }),
        );
        localStorage.setItem(
          "sppu_revise_prompt",
          new Date().toISOString().slice(0, 10),
        );
      }
    },
    { populated, version: TOUR_VERSION },
  );
}
async function study(page: any) {
  return page.evaluate(() =>
    JSON.stringify(
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
    ),
  );
}
for (const populated of [false, true])
  test(`every walkthrough is safe, readable and complete (${populated ? "populated" : "empty"})`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await seed(page, populated);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const id of Object.keys(paths) as TourId[]) {
      await page.goto(paths[id]);
      await page
        .getByRole("button", { name: `Replay ${TOURS[id].name} walkthrough` })
        .click();
      await page.getByRole("dialog").waitFor();
      const before = await study(page);
      await expect(page.locator("[data-tour=shell]")).toHaveAttribute(
        "inert",
        "",
      );
      await page.getByRole("button", { name: "Show me around" }).click();
      for (let i = 1; i <= TOURS[id].steps.length; i++) {
        await expect(
          page.getByRole("heading", {
            name: TOURS[id].steps[i - 1].title,
            exact: true,
          }),
        ).toBeVisible();
        await expect
          .poll(() =>
            page.evaluate((i) => {
              const t = document.querySelector(
                `.pt-tour-spotlight[data-step="${i}"]`,
              );
              return !!t || !!document.querySelector(".pt-tour-unavailable");
            }, i),
          )
          .toBeTruthy();
        await expect
          .poll(() =>
            page.evaluate(() => {
              const a = document
                .querySelector(".pt-tour-spotlight")
                ?.getBoundingClientRect();
              const b = document
                .querySelector(".pt-tour-card")!
                .getBoundingClientRect();
              return {
                overlap: a
                  ? !(
                      a.right <= b.left ||
                      a.left >= b.right ||
                      a.bottom <= b.top ||
                      a.top >= b.bottom
                    )
                  : false,
                overflow: document.documentElement.scrollWidth > innerWidth + 1,
                outside: b.top < 0 || b.bottom > innerHeight + 1,
              };
            }),
          )
          .toEqual({ overlap: false, overflow: false, outside: false });
        await expect(
          page.getByRole("button", {
            name: i === TOURS[id].steps.length ? "Done" : "Next",
            exact: true,
          }),
        ).toBeInViewport();
        await page
          .getByRole("button", {
            name: i === TOURS[id].steps.length ? "Done" : "Next",
            exact: true,
          })
          .click();
      }
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("[data-tour=shell]")).not.toHaveAttribute(
        "inert",
        "",
      );
      expect(await study(page)).toEqual(before);
      expect(
        await page.evaluate(
          ({ id, v }) => JSON.parse(localStorage.getItem(v) || "{}")[id],
          { id, v: TOUR_VERSION },
        ),
      ).toBe("done");
    }
  });
test("first visit, skip persistence, replay, opt-out and route cancellation", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/app");
  await page.evaluate((v) => localStorage.removeItem(v), TOUR_VERSION);
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Skip tour" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Replay Home walkthrough" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/app/resources");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/app/settings");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page
    .getByRole("checkbox", {
      name: "Offer a tour on my first visit to each screen",
    })
    .uncheck();
  await page.goto("/app/tasks");
  await expect(
    page.getByRole("button", { name: "Replay Tasks walkthrough" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Replay Tasks walkthrough" }).click();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => !!document.activeElement?.closest(".pt-tour-card"),
    ),
  ).toBeTruthy();
  await page.goto("/app/revise");
  await expect(
    page.getByRole("button", { name: "Replay Review walkthrough" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});
test("tour waits for consent, supports short viewport, and passes axe", async ({
  page,
}) => {
  await seed(page);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/app/settings");
  await page
    .getByRole("button", { name: "Replay Settings walkthrough" })
    .click();
  await page.addScriptTag({
    content: fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8"),
  });
  for (let i = 0; i < TOURS.settings.steps.length; i++) {
    const errors = await page.evaluate(async () =>
      (
        await (window as any).axe.run(document.querySelector(".pt-tour"), {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        })
      ).violations.map((v: any) => v.id),
    );
    expect(errors).toEqual([]);
    await page
      .getByRole("button", {
        name: i === 0 ? "Show me around" : "Next",
        exact: true,
      })
      .click();
  }
  await page.keyboard.press("Escape");
  await page.evaluate((v) => {
    localStorage.removeItem(v);
    localStorage.removeItem("pt_ga_consent");
  }, TOUR_VERSION);
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Cookie consent" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("daily review prompt is dismissed before the first-use tour", async ({
  page,
}) => {
  await seed(page, true);
  await page.goto("/app");
  await page.evaluate((v) => {
    localStorage.removeItem(v);
    localStorage.removeItem("sppu_revise_prompt");
  }, TOUR_VERSION);
  await page.reload();
  await expect(page.getByRole("dialog")).toContainText("Topic to revise today");
  await expect(
    page.getByRole("heading", { name: TOURS.home.intro }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Later", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: TOURS.home.intro }),
  ).toBeVisible();
});
