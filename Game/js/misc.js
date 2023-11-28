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
    static collideBox(p1, s1, p2, s2) {
        if (p1.x > p2.x + s2.x || p1.x + s1.x < p2.x || p1.y > p2.y + s2.y || p1.y + s1.y < p2.y) return false;
        return true;
    }
    static collideBox(p1, s1, r1, p2, s2, r2) {
        // Распаковываем значения квадратов
        var x1 = p1.x;
        var y1 = p1.y;
        var width1 = s1.x;
        var height1 = s1.y;
        var rotation1 = r1;
        var x2 = p2.x;
        var y2 = p2.y;
        var width2 = s2.x;
        var height2 = s2.y;
        var rotation2 = r2;

        // Сдвигаем квадраты в начало координат
        let centerX1 = x1;
        let centerY1 = y1;
        let centerX2 = x2;
        let centerY2 = y2;
        // Изменяем поворот квадратов на противоположный
        rotation1 = -rotation1;
        rotation2 = -rotation2;
        // Поворачиваем квадраты относительно центра координат
        let rotatedX1 = (x1 - centerX1) * Math.cos(rotation1) - (y1 - centerY1) * Math.sin(rotation1) + centerX1;
        let rotatedY1 = (x1 - centerX1) * Math.sin(rotation1) + (y1 - centerY1) * Math.cos(rotation1) + centerY1;
        let rotatedX2 = (x2 - centerX2) * Math.cos(rotation2) - (y2 - centerY2) * Math.sin(rotation2) + centerX2;
        let rotatedY2 = (x2 - centerX2) * Math.sin(rotation2) + (y2 - centerY2) * Math.cos(rotation2) + centerY2;
        // Проверяем пересечение повернутых квадратов
        if (
            rotatedX1 < rotatedX2 + width2 &&
            rotatedX1 + width1 > rotatedX2 &&
            rotatedY1 < rotatedY2 + height2 &&
            rotatedY1 + height1 > rotatedY2
        ) {
            return true;
        }
        return false;
    }
}