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
