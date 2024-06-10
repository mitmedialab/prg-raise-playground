import { chromium } from 'playwright';
import { expect } from 'playwright/test';
import * as path from 'path';

(async () => {
    // Launch a browser instance
    const browser = await chromium.launch({ headless: false }); // Set headless: false to see the browser actions
    const context = await browser.newContext({
        permissions: ['camera'],
        acceptDownloads: true
    });
    const page = await context.newPage();
    await page.goto('http://localhost:8602/');

    // All the extensions that are already there
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


    await page.waitForSelector('.blocklyWorkspace');

    // Make sure no blocks are dragged out of the workspace
    function boundY(y: any) {
        if (y > 600) {
            return 600;
        } 
        return y;
    }

    // Declaring constants
    const startX = 400;
    const startY = 130;
    const scale = 0.35;

    // Add the extension
    const addExtension = await page.$('[title="Add Extension"]');
    if (addExtension) {
        await addExtension.click();
        const parentElement = await page.$('.library_library-scroll-grid_1jyXm.library_withFilterBar_26Opm');

        if (parentElement) {
            const childElements = await parentElement.$$('.library-item_library-item_1DcMO.library-item_featured-item_3V2-t.library-item_library-item-extension_3xus9'); // Adjust the selector to match the child element type
            const elementsWithSpan: any = [];
            // Collect all the elements that haven't been added
            for (const child of childElements) {
                const spanElement = await child.$('span:first-of-type');
                if (spanElement) {
                    const textContent = await child.textContent();
                    if (includedExtensions.some(phrase => textContent?.includes(phrase))) {
                        elementsWithSpan.push(child);
                    }
                }
            }
            // Now find the elements that HAVE been added
            var chosenElements: any = [];
            for (const child of childElements) {
                if (!elementsWithSpan.includes(child)) {
                    chosenElements.push(child);
                }
            }

            // This element has been added
            if (chosenElements[0]) {
                // Collect the title of the added extension
                const firstSpan = await chosenElements[0].$('span:first-of-type');
                if (firstSpan) {
                    const spanText = await firstSpan.textContent();
                    await chosenElements[0].click();
                
                    const elementLocator = page.locator(`.blocklyFlyoutLabelText:has-text("${spanText}")`);
                    await elementLocator.waitFor();
                    await page.waitForTimeout(1000);
                    
                    // Now collect the element types
                    const hatElements = await page.$$(`[data-category="${spanText}"][data-shapes="hat"]`);
                    const stackElements = await page.$$(`[data-category="${spanText}"][data-shapes="stack"]`);
                    const elements = await page.$$(`[data-category="${spanText}"]:not([data-shapes="stack"]):not([data-shapes="hat"])`);
                    
                    const blocklyZoomElement = await page.waitForSelector('.blocklyZoom', { timeout: 5000 });

                    // Zoom all the way out
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

                    let stackMax = 0;
                    // If there are hat elements
                    if (hatElements.length > 0) {
                        let tempScroll = 0;
                        
                        let xOffset = startX;
                        for (const hatElement of hatElements) {

                            let yOffset = startY;
                            
                            // Reset the scroll position
                            if (tempScroll > 0) {
                                await page.mouse.move(100, 100);
                                await page.mouse.wheel(0, -1*tempScroll);
                                await page.waitForTimeout(500);
                                tempScroll = 0;
                            }

                            // Check if we have to scroll down to find the element
                            const boundingBox1 = await hatElement.boundingBox();
                            if (boundingBox1) {
                                let found = false;
                                while (!found) {
                                    try {
                                        await hatElement.hover({ timeout: 100 });
                                        found = true;
                                        await page.waitForTimeout(500);
                                    } catch (error) {
                                        await page.mouse.move(100, 100);
                                        await page.mouse.wheel(0, boundingBox1.height);
                                        tempScroll = tempScroll + boundingBox1.height;
                                    }
                                }
                            }

                            // Move the hat element
                            const hatBoundingBox = await hatElement.boundingBox();
                            if (hatBoundingBox) {
                                await page.mouse.move(hatBoundingBox.x + hatBoundingBox.width / 2, hatBoundingBox.y + hatBoundingBox.height / 2);
                                await page.mouse.down();
                                await page.mouse.move(xOffset+hatBoundingBox.width/2, boundY(yOffset));
                                await page.mouse.up();
                                yOffset += hatBoundingBox.height * scale;
                                // Add each stack element underneath the hat element
                                for (const stackElement of stackElements) {
                                    // Reset the scroll if needed
                                    if (tempScroll > 0) {
                                        await page.mouse.move(100, 100);
                                        await page.mouse.wheel(0, -1*tempScroll);
                                        await page.waitForTimeout(500);
                                        tempScroll = 0;
                                    }
                                    const boundingBox1 = await stackElement.boundingBox();
                                    // Check if we have to scroll down to find the element
                                    if (boundingBox1) {
                                        let found = false;
                                        while (!found) {
                                            try {
                                                await stackElement.hover({ timeout: 100 });
                                                found = true;
                                                await page.waitForTimeout(500);
                                            } catch (error) {
                                                await page.mouse.move(100, 100);
                                                await page.mouse.wheel(0, boundingBox1.height);
                                                tempScroll = tempScroll + boundingBox1.height;
                                            }
                                        }
                                        
                                    }
                                    // Move the stack element under the hat element
                                    const stackBoundingBox = await stackElement.boundingBox();
                                    if (stackBoundingBox) {
                                        await page.mouse.move(stackBoundingBox.x + stackBoundingBox.width / 2, stackBoundingBox.y + stackBoundingBox.height / 2);
                                        await page.mouse.down();
                                        await page.mouse.move(xOffset+stackBoundingBox.width / 2, boundY(yOffset));
                                        await page.mouse.up();
                                        // Set the max Y value for the remaining blocks
                                        if (yOffset > stackMax) {
                                            stackMax = yOffset;
                                        }
                                        yOffset += stackBoundingBox.height * scale;
                                    } 
                                }
                                // Move to the right for each stack
                                xOffset = xOffset + 50;
                                // Reset the scroll if needed
                                if (tempScroll > 0) {
                                    await page.mouse.move(100, 100);
                                    await page.mouse.wheel(0, -1*tempScroll);
                                    await page.waitForTimeout(500);
                                    tempScroll = 0;
                                }
                            } 
                        }
                    } else {
                        // If there are no hat elements, create one stack
                        let tempScroll = 0;
                        let yOffset = startY;
                        for (const element of stackElements) {
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
                                    } catch (error) {
                                        await page.mouse.move(100, 100);
                                        await page.mouse.wheel(0, boundingBox1.height);
                                        tempScroll = tempScroll + boundingBox1.height;
                                    }
                                }  
                            }
                            const boundingBox = await element.boundingBox();
                            // Move the stack element to the right
                            if (boundingBox) {
                                yOffset += boundingBox.height * scale;
                                await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                                await page.mouse.down();
                                await page.mouse.move(startX+boundingBox.width / 2, boundY(yOffset));
                                await page.mouse.up();
                                // Set the max Y value for the remaining blocks
                                if (yOffset > stackMax) {
                                    stackMax = yOffset;
                                }
                            } 
                        }
                        // Reset the scroll if needed
                        if (tempScroll > 0) {
                            await page.mouse.move(100, 100);
                            await page.mouse.wheel(0, -1*tempScroll);
                            await page.waitForTimeout(500);
                            tempScroll = 0;
                        }
                    }

                    // Collect all the input elements
                    const firstBlocklyBlockCanvas = await page.$('.blocklyBlockCanvas');
                    const inputElements = firstBlocklyBlockCanvas 
                        ? await firstBlocklyBlockCanvas.$$('.blocklyEditableText:not([data-argument-type="dropdown"]):not(:has(.blocklyDropdownText))')
                        : [];

                    // Set the starting y value for the input elements
                    var maxY = stackMax+5;

                    let inputIndex = 0;
                    let inputOffset = 0;
                    let tempScroll = 0;

                    for (const element of elements) {
                        // Reset the scroll if needed
                        if (tempScroll > 0) {
                            await page.mouse.move(100, 100);
                            await page.mouse.wheel(0, -1*tempScroll);
                            await page.waitForTimeout(500);
                            tempScroll = 0;
                        }
                        // Check if we need to scroll down to find the block
                        const boundingBox1 = await element.boundingBox();
                        if (boundingBox1) {
                            let found = false;
                            while (!found) {
                                try {
                                    await element.hover({ timeout: 100 });
                                    found = true;
                                } catch (error) {
                                    await page.mouse.move(100, 100);
                                    await page.mouse.wheel(0, boundingBox1.height);
                                    tempScroll = tempScroll + boundingBox1.height;
                                }
                            }
                        }
                        // Move the input element
                        const boundingBox = await element.boundingBox();
                        if (boundingBox) {
                            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                            await page.mouse.down();
                            var moveX: any;
                            var moveY: any;
                            
                            if (inputIndex >= inputElements.length) { // If there are input boxes left to move to
                                inputOffset = inputOffset + boundingBox.height / 2;
                                moveX = startX + (boundingBox.width / 2);
                                moveY = maxY + inputOffset;
                            } else { // Otherwise, move below the stacks
                                const inputBoundingBox = await inputElements[inputIndex].boundingBox();
                                if (inputBoundingBox) {
                                    moveX = inputBoundingBox.x + (boundingBox.width / 2);
                                    moveY = inputBoundingBox.y + (boundingBox.height / 2);
                                }
                            }

                            await page.mouse.move(moveX, boundY(moveY));
                            await page.mouse.up();
                            inputIndex = inputIndex + 1;
                            await page.waitForTimeout(1000);
                            
                            // Increment the yOffset for the next element
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

    // Save the download to comboBlocks
    await download.saveAs(path.join(downloadPath, "comboBlocks.sb3"));
    console.log(`File downloaded to: ${path.join(downloadPath, "comboBlocks.sb3")}`);
    await page.waitForTimeout(5000);
    await browser.close();
})();
