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

    maxSpeed: number;

    sign: number;
    magnitude: number;
    lineLost: boolean;

    INTERVAL = 1;
    isLoopRunning: boolean;

    keepDriving: boolean;
    drivingStarted: boolean;
    lastCommandTime: number;

    delay = 1;

    previousLeftSpeed: number;
    previousRightSpeed: number;

    constructor(public Kp: number, public baseSpeed: number, public minSpeed: number, public motorFunction: Function, public getSensorReading: Function) {
        this.keepDriving = true;
        this.lastCommandTime = Date.now();
        this.drivingStarted = false;
        this.isLoopRunning = false;
        this.previousLeftSpeed = 0;
        this.previousRightSpeed = 0;
        this.maxSpeed = this.baseSpeed * 2;
    }

    setBaseSpeed(newBase: number) {
        this.baseSpeed = newBase;
        this.maxSpeed = this.baseSpeed * 2;
    }

    centerTrue;
    lastSign = 0;

    // Main loop
    async loop() {
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
        
        const reading = this.getSensorReading("line");
        this.sensorValues = {
            "left": reading[0],
            "center": reading[1],
            "right": reading[2]
        }

        // ⏳ Auto-disable keepDriving if inactive > 5s
        if (Date.now() - this.lastCommandTime > 5000) {
            this.keepDriving = false;
            console.log("⛔ No turn commands received → stopping driving");
        }

        // console.log("Sensor values:", this.sensorValues);
        if (this.lastError === undefined) this.lastError = 0;

        const rawToLineStrength = (raw: number) => this.clamp(raw / 1000, 0, 1);
        const leftLine = rawToLineStrength(this.sensorValues.left);
        const centerLine = rawToLineStrength(this.sensorValues.center);
        const rightLine = rawToLineStrength(this.sensorValues.right);

        this.centerTrue = false;
        // If centered, do nothing (straight path)
        if (((leftLine > 0.9 && rightLine > 0.9) || (centerLine > 0.9)) 
            || (centerLine > leftLine && centerLine > rightLine && centerLine > 0.5) 
            || ((Math.abs(centerLine - rightLine) < 0.1) && (Math.abs(centerLine - leftLine) < 0.1) && centerLine > 0.5)) {
            this.sign = 0;
            this.magnitude = 0;
            // this.lastError = 0;
            this.lineLost = false;
            // console.log("✅ Centered on line");
            this.centerTrue = true;
            return;
        }

        const sideDiff = leftLine - rightLine;
        this.sign = Math.sign(sideDiff);

        const presence = leftLine + centerLine + rightLine;
        this.magnitude = 1 - this.clamp(presence / 3, 0, 1);
        const error = this.sign * this.magnitude;

        this.lineLost = presence < 0.3
            || (leftLine < 0.3 && rightLine < 0.3 && centerLine < 0.3)
            || (leftLine > centerLine && rightLine > centerLine && leftLine < 0.6 && rightLine < 0.6)
            || (this.centerTrue === false && Math.abs(leftLine - rightLine) < 0.1 && centerLine < 0.4 && leftLine < 0.9 && rightLine < 0.9);
        if (!this.lineLost) {
            this.lastError = error;
        } else {
            this.sign = Math.sign(this.lastError);
        }
        // COMMENT
        // console.log("sign", this.sign);
        // console.log("magnitude", this.magnitude);
        // console.log("LINE LOST", this.lineLost);
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
            this.motorFunction("l", 1000, 1000, this.baseSpeed, this.baseSpeed);
        }
        await this.sleep(this.delay);
    }

    async isCenter() {

        const reading = this.getSensorReading("line");
        let sensorValues = {
            "left": reading.left,
            "center": reading.center,
            "right": reading.right
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
            const sensorValues = this.getSensorReading("line");

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
        const alpha = 0.5;
        if (!this.keepDriving) return;
        let leftSpeed = 0;
        let rightSpeed = 0;

        if (this.lineLost) {
            leftSpeed = this.maxSpeed * (sign > 0 ? 0 : 1);
            rightSpeed = this.maxSpeed * (sign < 0 ? 0 : 1);
            leftSpeed = this.clamp(leftSpeed, this.minSpeed, this.maxSpeed);
            rightSpeed = this.clamp(rightSpeed, this.minSpeed, this.maxSpeed);
            console.log(`🚨 Line lost → turning ${sign > 0 ? "right" : "left"}`);
        } else {
            const error = sign * this.magnitude;
            const correction = this.Kp * error;
            leftSpeed = this.clamp(this.baseSpeed - correction * this.baseSpeed, this.minSpeed, this.maxSpeed);
            rightSpeed = this.clamp(this.baseSpeed + correction * this.baseSpeed, this.minSpeed, this.maxSpeed);
        }
        leftSpeed = alpha * this.previousLeftSpeed + (1 - alpha) * leftSpeed;
        rightSpeed = alpha * this.previousRightSpeed + (1 - alpha) * rightSpeed;
        console.log(`Speeds → L:${leftSpeed.toFixed(0)} R:${rightSpeed.toFixed(0)} Date: ${Date.now()}`);
        this.previousLeftSpeed = leftSpeed;
        this.previousRightSpeed = rightSpeed;
        this.motorFunction("l", 1000, 1000, Math.round(leftSpeed), Math.round(rightSpeed));
    }

    clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
}
