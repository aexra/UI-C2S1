export class Vec3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    copy() {
        return new Vec3(this.x, this.y, this.z);
    }
    translate(by) {
        this.x += by.x;
        this.y += by.y;
        this.z += by.z;
        return this;
    }
    translateTo(to) {
        this.x = to.x;
        this.y = to.y;
        this.z = to.z;
        return this;
    }
    add(what) {
        this.x += what.x;
        this.y += what.y;
        this.z += what.z;
    }
    equal(to) {
        if (this.x == to.x && this.y == to.y && this.z == to.z) return true;
        return false;
    }
    static minus(left, right) {
        return new Vec3(left.x - right.x, left.y - right.y, left.z - right.z);
    }
    static concat(left, right) {
        return new Vec3(left.x + right.x, left.y + right.y, left.z + right.z);
    }
}