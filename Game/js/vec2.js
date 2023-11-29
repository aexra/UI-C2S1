export class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    copy() {
        return new Vec2(this.x, this.y);
    }
    translate(by) {
        this.x += by.x;
        this.y += by.y;
        return this;
    }
    translateTo(to) {
        this.x = to.x;
        this.y = to.y;
        return this;
    }
    add(what) {
        this.x += what.x;
        this.y += what.y;
    }
    equal(to) {
        if (this.x == to.x && this.y == to.y) return true;
        return false;
    }
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    static minus(left, right) {
        return new Vec2(left.x - right.x, left.y - right.y);
    }
    static concat(left, right) {
        return new Vec2(left.x + right.x, left.y + right.y);
    }
}