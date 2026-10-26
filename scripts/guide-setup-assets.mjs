import { chromium } from "@playwright/test";
const b = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});
const p = await b.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
p.setDefaultTimeout(7000);
await p.addInitScript(() => localStorage.setItem("pt_ga_consent", "denied"));
await p.goto("http://127.0.0.1:5173/onboarding");
await p.getByRole("textbox").fill("Aarya");
await p
  .locator("main")
  .screenshot({ animations: "disabled", path: "public/guide/setup-name.png" });
await p.getByRole("button", { name: "Continue", exact: true }).click();
await p.getByRole("button", { name: /First year/i }).waitFor();
await p
  .locator("main")
  .screenshot({ animations: "disabled", path: "public/guide/setup-year.png" });
await p.getByRole("button", { name: /First year/i }).click();
await p.getByRole("button", { name: "Continue", exact: true }).click();
await p.getByRole("button", { name: "Start", exact: true }).waitFor();
await p.waitForFunction(
  () =>
    getComputedStyle(document.querySelector(".picker-flow")).opacity === "1",
);
await p
  .locator("main")
  .screenshot({
    animations: "disabled",
    path: "public/guide/setup-courses.png",
  });
await b.close();
