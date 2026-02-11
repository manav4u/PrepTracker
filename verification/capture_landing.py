
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Set viewport to 1920x1080 for a perfect 16:9 screenshot
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        await page.goto("http://localhost:3000/")

        # Wait for the HUD to render (it has a delay)
        await page.wait_for_selector("h1")
        # Give a little extra time for the animations to settle
        await page.wait_for_timeout(2000)

        # Take a full page screenshot
        await page.screenshot(path="verification/landing_page_full.png", full_page=True)

        # Take a 16:9 viewport screenshot for the portfolio (Hero section focus)
        await page.screenshot(path="verification/landing_page_portfolio_16_9.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
