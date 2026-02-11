import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # --- Desktop Capture ---
        print("Starting Desktop Capture...")
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})
        await page.goto("http://localhost:3000/")

        # Wait for initial load
        await page.wait_for_selector("h1")
        await page.wait_for_timeout(2000)

        # Scroll to trigger animations
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000) # Wait for bottom animations
        await page.evaluate("window.scrollTo(0, 0)") # Scroll back up
        await page.wait_for_timeout(1000) # Wait for top animations

        # Take portfolio hero shot (16:9)
        await page.screenshot(path="verification/landing_desktop_hero.png")
        print("Desktop Hero Captured.")

        # Take full page shot (scrolling down manually to ensure all elements render)
        # We scroll down step by step to trigger all scroll-based animations
        viewport_height = 1080
        total_height = await page.evaluate("document.body.scrollHeight")
        for i in range(0, total_height, viewport_height):
            await page.evaluate(f"window.scrollTo(0, {i})")
            await page.wait_for_timeout(500) # Wait for animation

        # Finally take the full page screenshot
        await page.screenshot(path="verification/landing_desktop_full.png", full_page=True)
        print("Desktop Full Page Captured.")

        await page.close()

        # --- Mobile Capture ---
        print("Starting Mobile Capture...")
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        )
        page_mobile = await context.new_page()
        await page_mobile.goto("http://localhost:3000/")

        await page_mobile.wait_for_selector("h1")
        await page_mobile.wait_for_timeout(2000)

        # Scroll down to trigger mobile animations
        await page_mobile.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page_mobile.wait_for_timeout(1000)

        # Take mobile full page shot
        await page_mobile.screenshot(path="verification/landing_mobile_full.png", full_page=True)
        print("Mobile Full Page Captured.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
