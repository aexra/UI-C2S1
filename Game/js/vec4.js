export class Vec4 {
    constructor(x, y, z, alpha) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.alpha = alpha || 0;
    }
    copy() {
        return new Vec4(this.x, this.y, this.z, this.alpha);
    }
}