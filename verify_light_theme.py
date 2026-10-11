from playwright.sync_api import sync_playwright

def run_verification(page):
    # Navigate to Landing Page
    page.goto("http://localhost:3000/#/landing")
    page.wait_for_timeout(1000)

    # Screenshot Landing Page
    page.screenshot(path="/home/jules/verification/screenshots/landing_page.png")
    page.wait_for_timeout(500)

    # Click on "Open Study Desk ↗"
    page.click("text=Open Study Desk ↗")
    page.wait_for_timeout(1000)

    # Screenshot Onboarding Step 1
    page.screenshot(path="/home/jules/verification/screenshots/onboarding_step1.png")
    page.wait_for_timeout(500)

    # Click "Continue" to go to Step 2
    page.click("text=Continue")
    page.wait_for_timeout(1000)

    # Screenshot Onboarding Step 2
    page.screenshot(path="/home/jules/verification/screenshots/onboarding_step2.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
