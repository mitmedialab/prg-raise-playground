import { chromium, Browser, BrowserContext, Page, ElementHandle } from 'playwright';
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

    await page.goto('http://localhost:8602/');
    await page.click('text=File');
    
    // UPLOAD ALL THE BLOCKS
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Load from your computer'),
      ]);
      
    const filePath = path.resolve(__dirname, 'downloads', 'allBlocks.sb3');
    await fileChooser.setFiles(filePath);

    // TEST 1: PROJECT CANNOT LOAD
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        if (dialog.message().includes("The project file that was selected failed to load.")) {
            console.log("Invalid opcode found.")
            console.log("TEST FAILED");
        }
        await dialog.accept();
      });

    // TEST 2: RUNTIME ERRORS
    page.on('pageerror', (error) => {
        console.log(`Uncaught runtime error: ${error.message}`);
        console.log
    });

    // TEST 3: INCOMPATIBLE FUNCTION TYPES
    let incompatibleTypes = false;
    page.on('console', (message) => {
        if (message.type() === 'error') {
            if (message.text().includes('gui Attempt to connect incompatible types.')) {
                console.log("Incompatible function types detected.")
                console.log("TEST FAILED");
                incompatibleTypes = true;
            }
        }
    });

    //await page.waitForSelector('.blocklyBlockCanvas', { timeout: 120000 });
    await page.waitForTimeout(2000);
    await page.click('text=File');
    const [fileChooser2] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Load from your computer'),
      ]);
      
    await fileChooser2.setFiles(filePath);
    //await page.waitForSelector('.blocklyBlockCanvas', { timeout: 120000 });
    await page.waitForTimeout(2000);


    // Wait until blockly canvas has children
    await page.$eval('.blocklyBlockCanvas', (element) => {
        return element.children.length > 0;
    });

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
        console.log('Successfully clicked in the middle of the blocklyZoom element.');
    } 

    // Collect all IDs that aren't arguments
    var dataIds = await page.$eval('.blocklyBlockCanvas', (blockCanvas) => {
        const elements = blockCanvas.querySelectorAll('[data-id]');
        const ids: any[] = [];
        elements.forEach((element: any) => {
            const opcode = element.getAttribute('data-opcode');
            if (opcode && opcode !== "math_number" && opcode !== "text" && !opcode.includes("_menu_")) {
                const dataId = element.getAttribute('data-id');
                if (dataId) {
                    const shape = element.getAttribute('data-shapes');
                    const opcode = element.getAttribute('data-opcode');
                    ids.push({ id: dataId, shape, opcode });
                }
            }
        });
        return ids;
    });
    
    // Collect all the arguments from the IDs
    const blocks: any[] = [];
    for (const id of dataIds) {

        var block = await page.$eval('.blocklyBlockCanvas', (blockCanvas: any, id: any) => {
            const element = blockCanvas.querySelector(`[data-id="${id}"]`);
            const argumentElements = (element as any).querySelectorAll('[data-argument-type]');
            
            const argumentList = Array.from(argumentElements).map(argElement => {
                const argumentType = (argElement as any).getAttribute('data-argument-type');
                const transform = (argElement as any).getAttribute('transform');
                const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/);
                let xValue = 0.0;
                if (match && match.length > 1) {
                    xValue = parseFloat(match[1]);
                }
                return {
                    type: argumentType,
                    xValue: String(xValue)
                }
            });
            const filteredArgumentList = argumentList.filter((arg, index, self) => {
                // TEST 4: NEW ARGUMENTS ADDED
                if (arg.type == 'round') {
                    // Checking to see if the "round" argument type has another value in it
                    const otherValueIncluded = self.some((otherArg: any, otherIndex: any) => otherIndex !== index && otherArg.xValue === arg.xValue);
                    if (!otherValueIncluded) {
                        console.log("New argument detected.");
                        console.log("TEST FAILED");
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            });
            // Sorting the argument types to get them in order
            const sortedArgumentList = filteredArgumentList.sort((a: any, b: any) => a.xValue - b.xValue).map(element => element.type);

            return {
                id: (element as any).getAttribute('data-id'),
                arguments: sortedArgumentList,
                opcode: (element as any).getAttribute('data-opcode'),
            };
        }, id.id);
        blocks.push(block);
    }

    // Helper function: checking if arrays match
    function arraysMatch(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    }

    // Now collect the argument order for the new version block values
    for (const block of blocks) {
        const selector = `[data-id="${block.opcode}"]`;
        const elementHandle = await page.$(selector);
    
        if (elementHandle) {
            const argumentElements = await elementHandle.$$('[data-argument-type]');
            
            const argumentList: any[] = await Promise.all(argumentElements.map(async argHandle => {
                const argumentType = await argHandle.getAttribute('data-argument-type');
                const transform = await argHandle.getAttribute('transform');
                let xValue = 0.0;
        
                if (transform) {
                  const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/);
                  if (match && match.length > 1) {
                    xValue = parseFloat(match[1]);  // Adjusted to get the y value instead of x value
                  }
                }
                return {
                  type: argumentType,
                  xValue: xValue
                };
            }));
            // TEST 5: CHECKING ARGUMENT ORDER
            const sortedArgumentList = argumentList.sort((a: any, b: any) => a.xValue - b.xValue).map(element => element.type);
             if (!arraysMatch(block.arguments, sortedArgumentList)) {
                console.log(block.arguments);
                console.log(sortedArgumentList);
                console.log("Argument order does not match.")
                console.log("TEST FAILED")
            } 
        }
    }

    await page.waitForTimeout(2000);
    await page.reload();

    // TEST 6: CHECKING WITH CONNECTED BLOCKS
    await page.click('text=File');
    const [fileChooser3] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Load from your computer'),
      ]);
      
    const filePath2 = path.resolve(__dirname, 'downloads', 'comboBlocks.sb3');
    console.log(`Uploading file from: ${filePath2}`);
    await fileChooser3.setFiles(filePath2);
    await page.waitForTimeout(5000);
    await browser.close();
})();
    