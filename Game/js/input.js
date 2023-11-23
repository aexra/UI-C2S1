export class InputHandler {
    constructor(game) {
        this.keys = [];
        this.mpx = null;
        this.mpy = null;
        this.game = game;

        window.addEventListener("keydown", (e) => {
            let key = e.key === 'ф'? 'a' : e.key === 'в'? 'd' : e.key === 'ц'? 'w' : e.key === 'ы'? 's' : e.key;
            if (this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
        });
        window.addEventListener("keyup", (e) => {
            if (e.key === 'ф') this.keys.splice(this.keys.indexOf('a'), 1);
            else if (e.key === 'в') this.keys.splice(this.keys.indexOf('d'), 1);
            else if (e.key === 'ы') this.keys.splice(this.keys.indexOf('s'), 1);
            else if (e.key === 'ц') this.keys.splice(this.keys.indexOf('w'), 1);
            else this.keys.splice(this.keys.indexOf(e.key), 1);
        });
        document.getElementById("canvas1").addEventListener("mousedown", (e) => {
            this.keys.push(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton");
        });
        document.getElementById("canvas1").addEventListener("mouseup", (e) => {
            this.keys.splice(this.keys.indexOf(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton"), 1);
        });
        document.getElementById("canvas1").addEventListener("mousemove", (e) => {
            this.mpx = e.clientX - game.canvasTranslated.x;
            this.mpy = e.clientY - game.canvasTranslated.y;
        });
        document.body.addEventListener("mouseup", (e) => {
            this.keys.splice(this.keys.indexOf(e.button === 0? "lmb" : e.button === 2? "rmb" : "undefinedMouseButton"), 1);
        });
    }
}