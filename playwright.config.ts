import { defineConfig } from "@playwright/test";

// E2E against the production build (dist/). `npm run build` runs first so the
// prerendered landing, 170 static library pages and the privacy page are all
// exercised exactly as deployed. Uses system Chrome when
// PLAYWRIGHT_CHROMIUM_PATH is set (local sandboxes), otherwise the Playwright
// chromium installed in CI.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    storageState: {
      cookies: [],
      origins: [
        {
          origin: "http://127.0.0.1:4173",
          localStorage: [
            { name: "pt_walkthrough_v1", value: '{"prompts":"off"}' },
          ],
        },
      ],
    },
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
