export class Light {
    constructor(position, radius, intensity=0.7, color = "rgba(1, 1, 1, 1)") {
        this.position = position;
        this.radius = radius;
        this.intensity = intensity;
        this.color = color;
    }
}