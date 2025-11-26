export default class LineArrayFollowing {

    // New reporter block to report line state: 
    // // left of line 
    // // right of line 
    // // on line 
    // // no line detected (initialization state) 
    // Also need a block to 'reset line state' (which would put it back 
    // add new blocks for: 
    // // start (continuous) driving 
    // // turn left 
    // // turn right 
    // // turn straight (english is hard) 
    // // implementation of 'start' driving should set up an interval so that if 
    // // no 'turn' command is received after some threshold, it will stop driving 
    // // (which should prevent the doodlebot from driving off tables often)

    lastError: number | undefined;
    sensorValues: { left: number; center: number; right: number } | undefined;

    sign: number;
    magnitude: number;
    lineLost: boolean;

    INTERVAL = 475;
    isLoopRunning: boolean;

    keepDriving: boolean;
    drivingStarted: boolean;
    lastCommandTime: number;

    delay = 475;

    constructor(public Kp: number, public baseSpeed: number, public maxSpeed: number, public minSpeed: number, public motorFunction: Function, public getSensorReading: Function) {
        this.keepDriving = true;
        this.lastCommandTime = Date.now();
        this.drivingStarted = false;
        this.isLoopRunning = false;
    }

    setMaxSpeed(newMax: number) {
        console.log("Setting max speed to", newMax);
        this.maxSpeed = newMax;
        console.log("Max speed is now", this.maxSpeed);
    }

    setBaseSpeed(newBase: number) {
        this.baseSpeed = newBase;
    }

    centerTrue;
    lastSign = 0;

    // Main loop
    async loop() {
        console.log("loop")
        // Stop immediately if keepDriving is false
        if (!this.keepDriving) {
            console.log("⛔ keepDriving false → stopping loop");
            this.isLoopRunning = false;
            this.drivingStarted = false;
            return;
        }

        this.isLoopRunning = true;
        // Schedule next iteration only if still driving
        setTimeout(() => {
            if (this.keepDriving) {
                this.loop();
            } else {
                this.isLoopRunning = false;
                console.log("🛑 Loop cancelled on next tick");
            }
        }, this.INTERVAL);
        const readings: { left: number; center: number; right: number }[] = [];
  
        // Collect 5 readings, spaced 50ms apart
        for (let i = 0; i < 3; i++) {
            const sensorValues = await this.getSensorReading("line");
            console.log("Sensor values:", sensorValues);
            if (sensorValues) {
            readings.push({
                left: sensorValues[0],
                center: sensorValues[1],
                right: sensorValues[2],
            });
            }
        await this.sleep(10);
            
        }
    
        // Compute averages (if we got any readings)
        if (readings.length > 0) {
            const avg = readings.reduce(
            (acc, r) => ({
                left: acc.left + r.left,
                center: acc.center + r.center,
                right: acc.right + r.right,
            }),
            { left: 0, center: 0, right: 0 }
            );
    
            const averaged = {
                left: avg.left / readings.length,
                center: avg.center / readings.length,
                right: avg.right / readings.length,
            };
    
            console.log("Averaged sensor:", averaged);
    
            // Follow the line with smoothed values
            this.sensorValues = averaged;
        }

        // ⏳ Auto-disable keepDriving if inactive > 5s
        if (Date.now() - this.lastCommandTime > 5000) {
            this.keepDriving = false;
            console.log("⛔ No turn commands received → stopping driving");
        } 

        // let sensorValues = await this.getSensorReading("line");
        // this.sensorValues = { left: sensorValues[0], center: sensorValues[1], right: sensorValues[2] };
        console.log("Sensor values:", this.sensorValues);
        if (this.lastError === undefined) this.lastError = 0;

        const rawToLineStrength = (raw: number) => this.clamp(raw / 1000, 0, 1);
        const leftLine = rawToLineStrength(this.sensorValues.left);
        const centerLine = rawToLineStrength(this.sensorValues.center);
        const rightLine = rawToLineStrength(this.sensorValues.right);

        this.centerTrue = false;
        // If centered, do nothing (straight path)
        if ((leftLine > 0.9 && rightLine > 0.9) || (centerLine > 0.9)) {
            this.sign = 0;
            this.magnitude = 0;
            this.lastError = 0;
            this.lineLost = false;
            console.log("✅ Centered on line");
            this.centerTrue = true;
            return;
        }

        const sideDiff = leftLine - rightLine;
        this.sign = Math.sign(sideDiff);

        const presence = leftLine + centerLine + rightLine;
        this.magnitude = 1 - this.clamp(presence / 3, 0, 1);
        const error = this.sign * this.magnitude;

        // this.lineLost = presence < 0.3 
        // || (leftLine > centerLine && rightLine > centerLine && leftLine < 0.6 && rightLine < 0.6)
        // || (Math.abs(leftLine - rightLine) < 0.1 && centerLine < 0.4 && leftLine < 0.9 && rightLine < 0.9);
        this.lineLost = presence < 0.3 
        || (leftLine < 0.3 && rightLine < 0.3 && centerLine < 0.3)
        || (leftLine > centerLine && rightLine > centerLine && leftLine < 0.6 && rightLine < 0.6) 
        || (this.centerTrue === false && Math.abs(leftLine - rightLine) < 0.1 && centerLine < 0.4 && leftLine < 0.9 && rightLine < 0.9);
        if (!this.lineLost) {
            this.lastError = error;
        } else {
            this.sign = Math.sign(this.lastError);
        }
        console.log("sign", this.sign);
        console.log("magnitude", this.magnitude);
        console.log("LINE LOST", this.lineLost);
    }

    /* Movement Commands */
    private updateTimer() {
        this.lastCommandTime = Date.now();
        this.keepDriving = true;  // turn commands resume driving
    }

    async turnLeft() {
        if (this.drivingStarted && this.keepDriving) {
            this.updateTimer();
            this.turn(1);
        }
        await this.sleep(this.delay);
    }

    async turnRight() {
        if (this.drivingStarted && this.keepDriving) {
            this.updateTimer();
            this.turn(-1);
        }  
        await this.sleep(this.delay);
    }

    async goStraight() {
        if (this.drivingStarted) {
            this.updateTimer();
            this.motorFunction("m", 1000, 1000, this.baseSpeed, this.baseSpeed);
        }
        await this.sleep(this.delay);
    }

    async isCenter() {

        let sensorValues;

        const readings: { left: number; center: number; right: number }[] = [];
  
        // Collect 5 readings, spaced 50ms apart
        for (let i = 0; i < 3; i++) {
            const sensorValues = await this.getSensorReading("line");
            console.log("Sensor values:", sensorValues);
            if (sensorValues) {
            readings.push({
                left: sensorValues[0],
                center: sensorValues[1],
                right: sensorValues[2],
            });
            }
        await this.sleep(10);
            
        }
    
        // Compute averages (if we got any readings)
        if (readings.length > 0) {
            const avg = readings.reduce(
            (acc, r) => ({
                left: acc.left + r.left,
                center: acc.center + r.center,
                right: acc.right + r.right,
            }),
            { left: 0, center: 0, right: 0 }
            );
    
            const averaged = {
                left: avg.left / readings.length,
                center: avg.center / readings.length,
                right: avg.right / readings.length,
            };
    
            console.log("Averaged sensor:", averaged);
    
            // Follow the line with smoothed values
            sensorValues = averaged;
        }



        const rawToLineStrength = (raw: number) => this.clamp(raw / 1000, 0, 1);
        const leftLine = rawToLineStrength(sensorValues.left);
        const centerLine = rawToLineStrength(sensorValues.center);
        const rightLine = rawToLineStrength(sensorValues.right);

        let centerTrue = false;
        // If centered, do nothing (straight path)
        if ((leftLine > 0.9 && rightLine > 0.9) || (centerLine > 0.9)) {
            centerTrue = true;
        }

        return centerTrue;

    }

    async recordSensorsAndDownloadCSV(robotName: string, calibrated, durationMs = 5000, intervalMs = 10) {
        const rows: string[] = [];

        // Add robot name and column header
        rows.push(`robot_name,${robotName}`);
        rows.push("time_ms,left,center,right"); 

        const startTime = Date.now();

        while (Date.now() - startTime < durationMs) {
            const sensorValues = await this.getSensorReading("line");

            if (sensorValues) {
                const timeMs = Date.now() - startTime;
                const left = sensorValues[0];
                const center = sensorValues[1];
                const right = sensorValues[2];

                rows.push(`${timeMs},${left},${center},${right}`);
            }

            await this.sleep(intervalMs);
        }

        const csv = rows.join("\n");

        // Download CSV in browser
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `sensor_data_${robotName}_${calibrated ? "calibrated" : "uncalibrated"}_${new Date().toISOString()}.csv`; // timestamps + robot name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("CSV file downloaded");
    }




    getLineStatus() { 
        let tempSign;
        if (this.lineLost) {
            const turnDir = this.lastError > 0 ? 1 : -1;
            tempSign = turnDir;
        } else {
            tempSign = this.sign;
        }
        if (tempSign === 0 && this.magnitude === 0) { return "on the line"; } 
        else if (tempSign > 0) { return "right of line"; } 
        else if (tempSign < 0) { return "left of line"; } 
        else { return "off the line"; } 
    }

    private turn(sign) {
        if (!this.keepDriving) return;
        let leftSpeed = 0;
        let rightSpeed = 0;

        if (this.lineLost) {
            leftSpeed = this.baseSpeed * (sign > 0 ? -0 : this.Kp);
            rightSpeed = this.baseSpeed * (sign < 0 ? -0 : this.Kp);
            leftSpeed = this.clamp(leftSpeed, this.minSpeed, this.maxSpeed);
            rightSpeed = this.clamp(rightSpeed, this.minSpeed, this.maxSpeed);
            console.log(`🚨 Line lost → turning ${sign > 0 ? "right" : "left"}`);
        } else {
            const error = sign * this.magnitude;
            const correction = this.Kp * error;
            leftSpeed = this.clamp(this.baseSpeed - correction * this.baseSpeed, this.minSpeed, this.maxSpeed);
            rightSpeed = this.clamp(this.baseSpeed + correction * this.baseSpeed, this.minSpeed, this.maxSpeed);
        }

        console.log(`Speeds → L:${leftSpeed.toFixed(0)} R:${rightSpeed.toFixed(0)}`);
        this.motorFunction("m", 1000, 1000, Math.round(leftSpeed), Math.round(rightSpeed));
    }

    clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
}
