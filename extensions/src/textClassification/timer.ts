export default function () {
    return {
        startTime: new Date().getTime(),
        start() {
            this.startTime = new Date().getTime();
        },
        elapsed() {
            return new Date().getTime() - this.startTime;
        }
    }
}