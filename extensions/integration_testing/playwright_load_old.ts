import { chromium, Browser, BrowserContext, Page, ElementHandle } from 'playwright';
import * as path from 'path';

(async () => {
    // Launch a browser instance
    const browser = await chromium.launch({ headless: false }); // Set headless: false to see the browser actions
    const context = await browser.newContext({
        permissions: ['camera'],
        acceptDownloads: true
    });
    const page = await context.newPage();

    // Navigate to 'Create' page
    await page.goto('http://localhost:8602/');
    await page.click('text=File');
    //await page.click('text=Load from your computer');
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Load from your computer'),
      ]);
      
    const filePath = path.resolve(__dirname, 'downloads', 'My Project.sb3');
    console.log(`Uploading file from: ${filePath}`);

    // Set the files to upload
    await fileChooser.setFiles(filePath);

    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        if (dialog.message().includes("The project file that was selected failed to load.")) {
            console.log("Invalid opcode found.")
            console.log("TEST FAILED");
        }
        // Optionally accept the dialog
        await dialog.accept();
      });

    let incompatibleTypes = false;
    page.on('console', (message) => {
        // Check if the message is an error
        if (message.type() === 'error') {
            // Check if the specific error message is logged
            if (message.text().includes('gui Attempt to connect incompatible types.')) {
                console.log("Incompatible function types detected.")
                console.log("TEST FAILED");
                incompatibleTypes = true;
            }
        }
    });
    await page.waitForSelector('.blocklyBlockCanvas');
    // Upload the file again for data-opcode to show up
    await page.click('text=File');
    const [fileChooser2] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('text=Load from your computer'),
      ]);
      
    await fileChooser2.setFiles(filePath);
    await page.waitForSelector('.blocklyBlockCanvas');


    // Wait until blockly canvas has children
    await page.$eval('.blocklyBlockCanvas', (element) => {
        return element.children.length > 0;
    });

    const blocklyZoomElement = await page.waitForSelector('.blocklyZoom', { timeout: 5000 });
    const boundingBox = await blocklyZoomElement.boundingBox();
    if (boundingBox) {
        // Calculate the middle of the element
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;

        // Click the middle of the element
        await page.mouse.click(x, y);
        await page.mouse.click(x, y);
        await page.mouse.click(x, y);
        await page.mouse.click(x, y);
        await page.mouse.click(x, y);
        await page.mouse.click(x, y);
        console.log('Successfully clicked in the middle of the blocklyZoom element.');
    } 

    // WE WON'T NEED THIS except for defining the elements and removing priitive opcodes
    var dataIds = await page.$eval('.blocklyBlockCanvas', (blockCanvas) => {
        const elements = blockCanvas.querySelectorAll('[data-id]');
        const ids: any = [];
    
        const calculateDepth = (element: any) => {
            let depth = 0;
            let currentElement = element.parentElement;
            while (currentElement) {
                depth++;
                currentElement = currentElement.parentElement;
            }
            return depth;
        };
    
        elements.forEach((element: any) => {
            const opcode = element.getAttribute('data-opcode');
            if (opcode && opcode !== "math_number" && opcode !== "text" && !opcode.includes("_menu_")) {
                const dataId = element.getAttribute('data-id');
                if (dataId) {
                    const shape = element.getAttribute('data-shapes');
                    const opcode = element.getAttribute('data-opcode');
                    const depth = calculateDepth(element);
                    ids.push({ id: dataId, shape, depth, opcode });
                }
            }
        });
    
        // Sort the ids array based on depth in descending order
        ids.sort((a: any, b: any) => b.depth - a.depth);
        return ids;
    });

    // const seenOpcodes: any[] = [];
    // for (const block of dataIds) {
    //     if (seenOpcodes.includes(block.opcode)) {
    //         console.log("HERE");
    //         const elementHandle = await page.$(`[data-id="${block.id}"]`);
    //         const box = await elementHandle?.boundingBox();
    //         if (box) {
    //             const x = box.x + box.width / 2;
    //             const y = box.y + box.height / 2;
    //             await page.mouse.click(x, y, { button: 'right' });
    //             try {
    //                 await page.click('text=Delete Block', { timeout: 500 });
    //             } catch(e) {

    //             }
    //             await page.waitForTimeout(500);
    //         }
            
    //     } else {
    //         seenOpcodes.push(block.opcode);
    //     }
    // }


    const minDepthNode = dataIds.reduce((minObj: any, currentObj: any) => {
        return currentObj.depth < minObj.depth ? currentObj : minObj;
    }, dataIds[0]);
    const minDepth = minDepthNode.depth;
    
    let moveX = 600;
    let moveY = 100;
    let alternate = false;
    for (const dataId of dataIds) {
        const elementHandle = await page.$(`[data-id="${dataId.id}"]`);
        if (elementHandle && dataId.depth > minDepth) {
            const box = await elementHandle.boundingBox();
            if (box) {
                const startX = box.x + box.width / 2;
                const startY = box.y + box.height / 2;


                await page.mouse.move(startX, startY);
                await page.mouse.down();
                await page.mouse.move(moveX, moveY);
                await page.mouse.up();
                moveY = moveY + 20;
                if (alternate) {
                    moveX = moveX + 20;
                    alternate = false;
                } else {
                    moveX = moveX - 20;
                    alternate = true;
                }
                await page.waitForTimeout(1000);
            }
        } 
    }
    // END WE WON'T NEED THIS

    var blocks = await page.$eval('.blocklyBlockCanvas', blockCanvas => {
        const elements = blockCanvas.querySelectorAll('[data-id]');
        return Array.from(elements).map(element => {
            const argumentElements = (element as any).querySelectorAll('[data-argument-type]');
            
            const argumentList = Array.from(argumentElements).map(argElement => {
                const argumentType = (argElement as any).getAttribute('data-argument-type');
                const transform = (argElement as any).getAttribute('transform');
                const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/);
                let yValue = 0.0;
                if (match && match.length > 1) {
                    yValue = parseFloat(match[1]);
                }
                return {
                    type: argumentType,
                    xValue: String(yValue)
                }
            });
            const filteredArgumentList = argumentList.filter((arg, index, self) => {
                console.log(arg.type);
                if (arg.type == 'round') {
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
            const sortedArgumentList = filteredArgumentList.sort((a: any, b: any) => a.xValue - b.xValue).map(element => element.type);

            return {
                id: (element as any).getAttribute('data-id'),
                arguments: sortedArgumentList,
                opcode: (element as any).getAttribute('data-opcode'),
            };
        });
    });

    blocks = blocks.filter((block: any) => {
        return block.opcode && block.opcode != "math_number" && block.opcode != "text" && !block.opcode.includes("_menu_");
    })

    
    function arraysMatch(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    }

    

    for (const block of blocks) {
        const selector = `[data-id="${block.opcode}"]`;
        const elementHandle = await page.$(selector);
    
        if (elementHandle) {
            const argumentElements = await elementHandle.$$('[data-argument-type]');
            
            const argumentList = await Promise.all(argumentElements.map(async argHandle => {
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
            const filteredArgumentList = argumentList.filter((arg, index, self) => {
                if (arg.type == 'round') {
                    const otherValueIncluded = self.some((otherArg: any, otherIndex: any) => otherIndex !== index && otherArg.xValue === arg.xValue);
                    if (!otherValueIncluded) {
                        console.log("New argument detected.")
                        console.log("TEST FAILED");
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            });
            const sortedArgumentList: any[] = filteredArgumentList.sort((a: any, b: any) => a.xValue - b.xValue).map(element => element.type);
            if (!arraysMatch(block.arguments, sortedArgumentList)) {
                
                console.log(block.arguments);
                console.log(sortedArgumentList);
                console.log("Argument order does not match.")
                console.log("TEST FAILED")
            } 
            

        }
       
    }

    



    await page.waitForTimeout(20000);

        // Close the browser
    await browser.close();
})();
    