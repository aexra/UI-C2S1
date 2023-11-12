export class InputHandler {
    constructor() {
        this.keys = [];

        window.addEventListener("keydown", (e) => {
            if (this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener("keyup", (e) => {
            this.keys.splice(this.keys.indexOf(e.key), 1);
        });
        document.getElementById("canvas1").addEventListener("mousedown", (e) => {
            this.keys.push(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton");
        });
        document.getElementById("canvas1").addEventListener("mouseup", (e) => {
            this.keys.splice(this.keys.indexOf(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton"), 1);
        });
    }
}