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

    const wheelDelta = 20;

    // Navigate to 'Create' page
    await page.goto('http://localhost:8602/');

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

    // Wait for the editor to load
    await page.waitForSelector('.blocklyWorkspace');

    const addExtension = await page.$('[title="Add Extension"]');
    if (addExtension) {
        await addExtension.click();
        const parentElement = await page.$('.library_library-scroll-grid_1jyXm.library_withFilterBar_26Opm');

        if (parentElement) {
            // Get the last child element of the parent element
            // library-item_library-item_1DcMO
            const childElements = await parentElement.$$('.library-item_library-item_1DcMO.library-item_featured-item_3V2-t.library-item_library-item-extension_3xus9'); // Adjust the selector to match the child element type
            const elementsWithSpan: any = [];

            for (const child of childElements) {
                const spanElement = await child.$('span:first-of-type');
                if (spanElement) {
                    const textContent = await child.textContent();
                    if (includedExtensions.some(phrase => textContent?.includes(phrase))) {
                        elementsWithSpan.push(child);
                    }
                }
            }
            var chosenElements: any = [];
            for (const child of childElements) {
                if (!elementsWithSpan.includes(child)) {
                    chosenElements.push(child);
                }
            }

            if (chosenElements[0]) {
                console.log("Last child element found");
                const firstSpan = await chosenElements[0].$('span:first-of-type');
            
                
                // Perform actions with the last child element if needed
                // Example: Click the last child element
                
                if (firstSpan) {
                    const spanText = await firstSpan.textContent();
                    //const spanText = "Face Sensing";
                    await chosenElements[0].click();
                
                    const elementLocator = page.locator(`.blocklyFlyoutLabelText:has-text("${spanText}")`);
                    await elementLocator.waitFor();
                    // await page.waitForFunction(() => {
                    //     const elements = Array.from(document.querySelectorAll('[transform^="translate("]'));
                    //     for (const element of elements) {
                    //         const transformValue = (element as any).getAttribute('transform');
                    //         if (transformValue && transformValue.includes(',8688)')) {
                    //             return true;
                    //         }
                    //     }
                    //     return false;
                    // });
                    await page.waitForTimeout(1000);
                    
                    const hatElements = await page.$$(`[data-category="${spanText}"][data-shapes="hat"]`);
                    const stackElements = await page.$$(`[data-category="${spanText}"][data-shapes="stack"]`);
                    const elements = await page.$$(`[data-category="${spanText}"]:not([data-shapes="stack"]):not([data-shapes="hat"])`);
                    
                    const viewport = page.viewportSize();
                    console.log("viewport");
                    console.log(viewport);

                    let scrollMax = 0;
                    let stackMax = 0;

                    if (hatElements.length > 0) {
                        let xOffset = 300;
                        let scroll = 0; 
                        for (const hatElement of hatElements) {
                            await hatElement.scrollIntoViewIfNeeded();
                            const hatBoundingBox = await hatElement.boundingBox();
                            if (hatBoundingBox) {
                                // scroll back up if needed
                                let yOffset = 450;
                                if (scroll > 0) {
                                    scroll = 0;
                                    await page.mouse.move(500, 300);
                                    await page.mouse.wheel(-1*scroll, 0);
                                }   
                                // move the block
                                await page.mouse.move(hatBoundingBox.x + hatBoundingBox.width / 2, hatBoundingBox.y + hatBoundingBox.height / 2);
                                await page.mouse.down();
                                await page.mouse.move(xOffset+hatBoundingBox.width/2, yOffset);
                                await page.mouse.up();
                                // add to the offset
                                yOffset += hatBoundingBox.height * 0.8;

                                // loop through stack elements
                                for (const stackElement of stackElements) {
                                    await stackElement.scrollIntoViewIfNeeded();
                                    const stackBoundingBox = await stackElement.boundingBox();
                                    if (stackBoundingBox) {
                                        await page.mouse.move(stackBoundingBox.x + stackBoundingBox.width / 2, stackBoundingBox.y + stackBoundingBox.height / 2);
                                        await page.mouse.down();
                                        await page.mouse.move(xOffset+stackBoundingBox.width / 2, yOffset);
                                        await page.mouse.up();
                                        // add to the offset
                                        yOffset += stackBoundingBox.height * 0.8;
                                        
                                        if (yOffset > 500) { // if you need to scroll
                                            scroll = scroll + wheelDelta;
                                            if (scroll > scrollMax) {
                                                scrollMax = scroll; // record the max scroll
                                            }
                                            yOffset -= wheelDelta; // take away from offset
                                            if (yOffset > stackMax) {
                                                stackMax = yOffset;
                                            }
                                            await page.mouse.move(500, 300);
                                            await page.mouse.wheel(0, wheelDelta);
                                        } else {
                                            if (yOffset > stackMax) {
                                                stackMax = yOffset;
                                            }
                                        }
                                    } 
                                }
                                xOffset = xOffset + 50;
                                // move back to the original position
                                if (scroll > 0) {
                                    await page.mouse.move(500, 300);
                                    await page.mouse.wheel(0, -1*scroll);
                                    scroll = 0;
                                } 
                            } else {
                                console.log("Failed to get bounding box for the hat element");
                            }
                        }

                    } else {
                        let yOffset = 450;
                        let scroll = 0;
                        let tempScroll = 0;
                        // make one stack of stack elements
                        for (const element of stackElements) {
                            if (tempScroll > 0) {
                                await page.mouse.move(100, 100);
                                await page.mouse.wheel(0, -1*tempScroll);
                                tempScroll = 0;
                            }
                            const boundingBox1 = await element.boundingBox();
                            // check if we have to scroll down to find the element
                            if (boundingBox1) {
                                let found = false;
                                
                                while (!found) {
                                    try {
                                        await element.hover({ timeout: 1000 });
                                        found = true;
                                        console.log('Successfully hovered over the element.');
                                    } catch (error) {
                                        await page.mouse.move(100, 100);
                                        await page.mouse.wheel(0, boundingBox1.height);
                                        tempScroll = tempScroll + boundingBox1.height;
                                    }
                                }
                                
                            }
                            const boundingBox = await element.boundingBox();
                            if (boundingBox) {
                                await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                                await page.mouse.down();
                                await page.mouse.move(400+boundingBox.width / 2, yOffset);
                                await page.mouse.up();
                                
                                yOffset += boundingBox.height*0.8;
                                console.log("getting y offset ", yOffset);
                                if (yOffset > 500) {
                                    scroll = scroll + boundingBox.height*0.8;
                                    if (scroll > scrollMax) {
                                        scrollMax = scroll;
                                    }
                                   
                                    yOffset -= boundingBox.height*0.8;
                                    if (yOffset > stackMax) {
                                        console.log("new y offset ", yOffset);
                                        stackMax = yOffset;
                                    }
                                    await page.mouse.move(500, 300);
                                    await page.mouse.wheel(0, boundingBox.height*0.8);
                                } else {
                                    if (yOffset > stackMax) {
                                        stackMax = yOffset;
                                    }
                                }
                                await page.waitForTimeout(1000);
                            } else {
                                console.log("Failed to get bounding box for the element");
                            }
                            
                        }
                        //move the mouse back to the original scroll position
                        if (scroll > 0) {
                            await page.mouse.move(500, 300);
                            await page.mouse.wheel(0, -1*scroll);
                            scroll = 0;
                        } 
                        if (tempScroll > 0) {
                            await page.mouse.move(100, 100);
                            await page.mouse.wheel(0, -1*tempScroll);
                            tempScroll = 0;
                        }
                    }
                    // find where all the input elements are
                    const firstBlocklyBlockCanvas = await page.$('.blocklyBlockCanvas');
                    const inputElements = firstBlocklyBlockCanvas 
                        ? await firstBlocklyBlockCanvas.$$('.blocklyEditableText:not([data-argument-type="dropdown"]):not(:has(.blocklyDropdownText))')
                        : [];

                    // Find out where we can place in the input elements in the stacks
                    var maxX = 400;
                    var maxY = stackMax; // stack max holds where the last position is with scroll
                    console.log("max y is", maxY);
                    var inputBoxes: any = [];
                    if (inputElements.length > 0) {
                        for (const element of inputElements) {
                            const boundingBox = await element.boundingBox();
                            if (boundingBox) {
                                inputBoxes.push(boundingBox);
                            }
                        }
                    } else {
                        inputBoxes = [{
                            x: 400,
                            y: stackMax,
                            width: 5,
                            height: 5
                        }]
                    }

                    let inputIndex = 0;
                    let inputOffset = 0;
                    let scrollDown = false;

                    // Now loop through the rest of the elements
                    let tempScroll = 0;
                    for (const element of elements) {
                        if (tempScroll > 0) {
                            await page.mouse.move(100, 100);
                            await page.mouse.wheel(0, -1*tempScroll);
                            tempScroll = 0;
                        }
                        const boundingBox1 = await element.boundingBox();
                        // check if we have to scroll down to find the element
                        if (boundingBox1) {
                            let found = false;
                            let tempScroll = 0;
                            while (!found) {
                                try {
                                    await element.hover({ timeout: 1000 });
                                    found = true;
                                    console.log('Successfully hovered over the element.');
                                  } catch (error) {
                                    await page.mouse.move(100, 100);
                                    await page.mouse.wheel(0, boundingBox1.height);
                                    tempScroll = tempScroll + boundingBox1.height;
                                  }
                            }
                            
                        }
                        
                        const boundingBox = await element.boundingBox();
                        if (boundingBox) {
                            var moveX;
                            var moveY;
                            let tempScroll2 = 0;
                            // If we still have input elements to go through
                            if (inputIndex >= inputBoxes.length) {
                                if (!scrollDown) {
                                    await page.mouse.move(500, 300);
                                    await page.mouse.wheel(0, scrollMax);
                                    console.log("scrolled down by, ", scrollMax);
                                    scrollDown = true;
                                }
                                inputOffset = inputOffset + boundingBox.height*0.8;
                                moveX = maxX;
                                moveY = maxY + inputOffset;
                                if (moveY > 500) {
                                    await page.mouse.move(500, 300);
                                    await page.mouse.wheel(0, wheelDelta);
                                    inputOffset = inputOffset - wheelDelta;
                                    moveY = moveY - wheelDelta;
                                }
                            } else {
                                moveX = inputBoxes[inputIndex].x + boundingBox.width / 2;
                                moveY = inputBoxes[inputIndex].y
                                if (moveY > 500) {
                                    await page.mouse.move(500, 300);
                                    tempScroll2 = moveY-500
                                    await page.mouse.wheel(0, tempScroll2);
                                    maxY = maxY - tempScroll2;
                                }
                            }
                            
                            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
                            await page.mouse.down();
                            await page.mouse.move(moveX, moveY);
                            await page.mouse.up();
                            console.log(`Element dragged to the same spot: ${await element.textContent()}`);

                            console.log(moveX);
                            console.log(moveY);
                            inputIndex = inputIndex + 1;
                            await page.waitForTimeout(1000);
                            if (tempScroll2 > 0) {
                                await page.mouse.move(500, 300);
                                await page.mouse.wheel(0, -1*tempScroll2);
                            }
                            
                            // Increment the yOffset for the next element
                        } else {
                            console.log("Failed to get bounding box for the element");
                        }
                    }
                } else {
                    console.log("No span elements found within the last child element");
                }
            } else {
                console.log("No child elements found");
            }
        } else {
            console.log("Parent element not found");
        }
    }
    
    // Save the project (if you want to)
    const downloadPath = path.resolve(__dirname, 'downloads');
    await page.click('text=File');
    await page.click('text=Save to your computer');
    const [download] = await Promise.all([
        page.waitForEvent('download'), // Wait for the download to start
    ]);

    // Save the download to the specified path
    await download.saveAs(path.join(downloadPath, await download.suggestedFilename()));
    console.log(`File downloaded to: ${path.join(downloadPath, await download.suggestedFilename())}`);
    await page.waitForTimeout(5000);


    // Close the browser
    await browser.close();
})();
