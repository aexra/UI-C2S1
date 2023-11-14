export class InputHandler {
    constructor() {
        this.keys = [];
        this.mpx = null;
        this.mpy = null;
        this.mcx = null;
        this.mcy = null;

        window.addEventListener("keydown", (e) => {
            let key = e.key === 'ф'? 'a' : e.key === 'в'? 'd' : e.key;
            if (this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
        });
        window.addEventListener("keyup", (e) => {
            if (e.key === 'ф') this.keys.splice(this.keys.indexOf('a'), 1);
            else if (e.key === 'в') this.keys.splice(this.keys.indexOf('d'), 1);
            else this.keys.splice(this.keys.indexOf(e.key), 1);
        });
        document.getElementById("canvas1").addEventListener("mousedown", (e) => {
            this.keys.push(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton");
            this.mcx = e.clientX;
            this.mcy = e.clientY;
        });
        document.getElementById("canvas1").addEventListener("mouseup", (e) => {
            this.keys.splice(this.keys.indexOf(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton"), 1);
            this.mcx = null;
            this.mcy = null;
        });
        document.getElementById("canvas1").addEventListener("mouseover", (e) => {
            this.mpx = e.clientX;
            this.mpy = e.clientY;
        });
    }
}