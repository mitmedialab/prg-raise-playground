const { exec } = require('child_process');

let devProcess: any;

async function runDevScript(param: string): Promise<void> {
    return new Promise((resolve, reject) => {
      devProcess = exec(`cd ../.. && pnpm dev -i ${param}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`Error running dev script: ${error}`);
          reject(error);
        } else {
          console.log(`Dev script output: ${stdout}`);
          resolve();
        }
      });
  
      devProcess.stdout.on('data', (data: any) => {
        console.log(`stdout: ${data}`);
      });
  
      devProcess.stderr.on('data', (data: any) => {
        console.error(`stderr: ${data}`);
      });
    });
  }

  async function runPlaywrightScript(scriptName: string) {
    return new Promise((resolve, reject) => {
        const command = `npx ts-node ${scriptName}`;
        const playwrightProcess = exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error(`Error running script: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Error output: ${stderr}`);
                reject(stderr);
            }
            console.log(`Script output: ${stdout}`);
            resolve(stdout);
        });

        playwrightProcess.stdout.on('data', (data: any) => {
            console.log(`stdout: ${data}`);
          });
      
          playwrightProcess.stderr.on('data', (data: any) => {
            console.error(`stderr: ${data}`);
          });
    });
}


async function runPlaywrightTasks() {
    try {
      await runPlaywrightScript('playwright_save_all.ts');
      await runPlaywrightScript('playwright_save_combo.ts');
      await runPlaywrightScript('playwright_load.ts');
      process.exit(0);
    } catch (error) {
      console.error('Error during Playwright tasks:', error);
    } 
  }

async function main() {
    const args = process.argv.slice(2); 
  
    if (args.length === 0) {
      console.error('Please provide a parameter.');
      return;
    }
  
    const param = args[0]; 
  
    try {
      runDevScript(param);
      console.log('Dev script started successfully');
      runPlaywrightTasks();
    } catch (error) {
      console.error('Error running script:', error);
    }
  }

  main();
