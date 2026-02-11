
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the landing page - UPDATED PORT
        await page.goto("http://localhost:3000/")

        # Wait for the hero section to be visible
        await page.wait_for_selector("h1")

        # Take a full page screenshot
        await page.screenshot(path="verification/landing_page_full.png", full_page=True)

        # Take a viewport screenshot for the portfolio (Hero section focus)
        await page.screenshot(path="verification/landing_page_hero.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
