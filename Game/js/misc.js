import { Vec2 } from "./vec2.js";

export class Random {
    static randi(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static randf(min, max, decimals) {
        const str = (Math.random() * (max - min) + min).toFixed(
          decimals,
        );
      
        return parseFloat(str);
    }
}

export class Collision {
    static collideBox(center1, size1, center2, size2) {
        const halfWidth1 = size1.x / 2;
        const halfHeight1 = size1.y / 2;
        const halfWidth2 = size2.x / 2;
        const halfHeight2 = size2.y / 2;

        const left1 = center1.x - halfWidth1;
        const right1 = center1.x + halfWidth1;
        const top1 = center1.y - halfHeight1;
        const bottom1 = center1.y + halfHeight1;

        const left2 = center2.x - halfWidth2;
        const right2 = center2.x + halfWidth2;
        const top2 = center2.y - halfHeight2;
        const bottom2 = center2.y + halfHeight2;

        if (left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2) {
            return false;
        }

        return true;
    }
    // static collideBox(c1, s1, r1, c2, s2, r2) {
    //     function areRectanglesIntersecting(center1, size1, angle1, center2, size2, angle2) {
    //         function rotatePoint(x, y, angle) {
    //             const cosAngle = Math.cos(angle);
    //             const sinAngle = Math.sin(angle);
    //             const newX = x * cosAngle - y * sinAngle;
    //             const newY = x * sinAngle + y * cosAngle;
    //             return { x: newX, y: newY };
    //         }
        
    //         function isPointInsideRectangle(point, center, size, angle) {
    //             const rotatedPoint = rotatePoint(point.x - center.x, point.y - center.y, -angle);
    //             const halfWidth = size.width / 2;
    //             const halfHeight = size.height / 2;
    //             return (
    //                 rotatedPoint.x >= -halfWidth &&
    //                 rotatedPoint.x <= halfWidth &&
    //                 rotatedPoint.y >= -halfHeight &&
    //                 rotatedPoint.y <= halfHeight
    //             );
    //         }
        
    //         const halfWidth1 = size1.width / 2;
    //         const halfHeight1 = size1.height / 2;
    //         const halfWidth2 = size2.width / 2;
    //         const halfHeight2 = size2.height / 2;
        
    //         const corners1 = [
    //             { x: center1.x - halfWidth1, y: center1.y - halfHeight1 },
    //             { x: center1.x + halfWidth1, y: center1.y - halfHeight1 },
    //             { x: center1.x + halfWidth1, y: center1.y + halfHeight1 },
    //             { x: center1.x - halfWidth1, y: center1.y + halfHeight1 },
    //         ];
        
    //         const corners2 = [
    //             { x: center2.x - halfWidth2, y: center2.y - halfHeight2 },
    //             { x: center2.x + halfWidth2, y: center2.y - halfHeight2 },
    //             { x: center2.x + halfWidth2, y: center2.y + halfHeight2 },
    //             { x: center2.x - halfWidth2, y: center2.y + halfHeight2 },
    //         ];
        
    //         for (const corner of corners1) {
    //             if (isPointInsideRectangle(corner, center2, size2, angle2)) {
    //                 return true;
    //             }
    //         }
        
    //         for (const corner of corners2) {
    //             if (isPointInsideRectangle(corner, center1, size1, angle1)) {
    //                 return true;
    //             }
    //         }
        
    //         return false;
    //     }

    //     var result = areRectanglesIntersecting(c1, s1, r1, c2, s2, r2);
    //     console.log(result)
    //     return result;
    // }
}

export class Config {
    static audio = {
        music: 0.1,
        sfx: 0.1,
    };
    static load() {
        this.audio = {
            music: localStorage.getItem("music-volume") ?? 0.1,
            sfx: localStorage.getItem("sfx-volume") ?? 0.1,
        };
    }
}