import { chromium } from 'playwright';
import { expect } from 'playwright/test';
import * as path from 'path';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    // Launch a browser instance
    const browser = await chromium.launch({ headless: false }); // Set headless: false to see the browser actions
    const context = await browser.newContext({
        permissions: ['camera'],
        acceptDownloads: true
    });
    const page = await context.newPage();
    let connected = false;
    for (let i = 0; i < 120; i++) { // Retry up to 10 times
        try {
        await page.goto('http://localhost:8602/', { waitUntil: 'networkidle', timeout: 6000 });
        connected = true;
        break;
        } catch (e) {
        console.log('Connection failed, retrying...');
        await delay(5000); // Wait for 5 seconds before retrying
        }
    }

    // All the extensions that have been included
    const includedExtensions = [
        "PRG Microbit Robot",
        "PRG Gizmo Robot",
        "PRG Arduino Robot",
        "Music",
        "Pen",
        "Video Sensing",
        "Text to Speech",
        "Translate",
        "Makey Makey",
        "micro:bit",
        "LEGO MINDSTORMS EV3",
        "LEGO BOOST",
        "LEGO Education WeDo 2.0",
        "Go Direct Force & Acceleration"
    ];

    // Declaring constants
    const startX = 400;
    const startY = 130;

    // Wait for the editor to load
    //await page.waitForSelector('.blocklyBlockCanvas');
    await page.waitForTimeout(2000);
    // Add the extension
    const addExtension = await page.$('[title="Add Extension"]');
    if (addExtension) {
        await addExtension.click();
        const parentElement = await page.$('.library_library-scroll-grid_1jyXm.library_withFilterBar_26Opm');
        if (parentElement) {
            const childElements = await parentElement.$$('.library-item_library-item_1DcMO.library-item_featured-item_3V2-t.library-item_library-item-extension_3xus9'); // Adjust the selector to match the child element type
            const elementsWithSpan: any = [];

            // Collect the extensions that are already included
            for (const child of childElements) {
                const spanElement = await child.$('span:first-of-type');
                if (spanElement) {
                    const textContent = await child.textContent();
                    if (includedExtensions.some(phrase => textContent?.includes(phrase))) {
                        elementsWithSpan.push(child);
                    }
                }
            }
            // Find the extension that was added
            var chosenElements: any = [];
            for (const child of childElements) {
                if (!elementsWithSpan.includes(child)) {
                    chosenElements.push(child);
                }
            }

            if (chosenElements[0]) { // The added extension
                const firstSpan = await chosenElements[0].$('span:first-of-type');
                // Collect the title of the added extension
                if (firstSpan) {
                    const spanText = await firstSpan.textContent();
                    await chosenElements[0].click();
                    const elementLocator = page.locator(`.blocklyFlyoutLabelText:has-text("${spanText}")`);
                    await elementLocator.waitFor();
                    await page.waitForTimeout(1000);
                    // Find all the blocks under the added extension
                    const elements = await page.$$(`[data-category="${spanText}"]`);
                    
                    // Zoom all the way out
                    const blocklyZoomElement = await page.waitForSelector('.blocklyZoom', { timeout: 5000 });
                    const boundingBox = await blocklyZoomElement.boundingBox();
                    if (boundingBox) {
                        const x = boundingBox.x + boundingBox.width / 2;
                        const y = boundingBox.y + boundingBox.height / 2;
                        await page.mouse.click(x, y);
                        await page.mouse.click(x, y);
                        await page.mouse.click(x, y);
                        await page.mouse.click(x, y);
                        await page.mouse.click(x, y);
                        await page.mouse.click(x, y);
                    } 

                    // Starting values
                    let tempScroll = 0;
                    let yOffset = startY;
                    let xOffset = startX;
                    // Add each element
                    for (const element of elements) {
                        // Reset the scroll if needed
                        if (tempScroll > 0) {
                            await page.mouse.move(100, 100);
                            await page.mouse.wheel(0, -1*tempScroll);
                            await page.waitForTimeout(500);
                            tempScroll = 0;
                        }
                        const boundingBox1 = await element.boundingBox();
                        // Check if we have to scroll down to find the element
                        if (boundingBox1) {
                            let found = false;
                            while (!found) {
                                try {
                                    await element.hover({ timeout: 100 });
                                    found = true;
                                    await page.waitForTimeout(500);
                                } catch (error) {
                                    await page.mouse.move(100, 100);
                                    await page.mouse.wheel(0, boundingBox1.height);
                                    tempScroll = tempScroll + boundingBox1.height;
                                }
                            }
                        }

                        const boundingBox = await element.boundingBox();
                        if (boundingBox) {
                            // Move the mouse to the center of the element
                            yOffset += 20;
                            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                            await page.mouse.down();
                            let x = xOffset + boundingBox.width / 2;
                            await page.mouse.move(x, yOffset);
                            await page.mouse.up();

                            // If we've gone all the way to the right, start again
                            xOffset = xOffset + 20;
                            if (xOffset > 600) {
                                xOffset = startX;
                            }
                            // Scroll if we've reached the bottom of the workspace
                            if (yOffset > 600) {
                                await page.mouse.move(500, 300);
                                await page.mouse.wheel(0, 10);
                                yOffset = yOffset - 15;
                            }
                        } 
                    }
                } 
            } 
        } 
    }
    
    // Save the project
    const downloadPath = path.resolve(__dirname, 'downloads');
    await page.click('text=File');
    await page.click('text=Save to your computer');
    const [download] = await Promise.all([
        page.waitForEvent('download'),
    ]);

    // Save the download to allBlocks.sb3
    await download.saveAs(path.join(downloadPath, "allBlocks.sb3"));
    console.log(`File downloaded to: ${path.join(downloadPath, "allBlocks.sb3")}`);
    await page.waitForTimeout(5000);
    await browser.close();
})();
