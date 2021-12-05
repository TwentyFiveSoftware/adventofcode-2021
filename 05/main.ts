import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

const lines = input
    .split('\n')
    .map(l => l.replace(' -> ', ',').split(',').map(Number))
    .map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2 }));

const horizontalAndVerticalLines = lines.filter(l => l.x1 === l.x2 || l.y1 === l.y2);
const diagonalLines = lines.filter(l => !(l.x1 === l.x2 || l.y1 === l.y2));


const getMapWithHorizontalAndVerticalLines = () => {
    const map = new Map<string, number>();

    for (const line of horizontalAndVerticalLines)
        for (let x = Math.min(line.x1, line.x2); x <= Math.max(line.x1, line.x2); x++)
            for (let y = Math.min(line.y1, line.y2); y <= Math.max(line.y1, line.y2); y++)
                map.set(`${x},${y}`, (map.get(`${x},${y}`) ?? 0) + 1);

    return map;
};


(() => {
    const map = getMapWithHorizontalAndVerticalLines();

    const overlappingFieldCount = Array.from(map.values()).filter(n => n >= 2).length;
    console.log('PART 1:', overlappingFieldCount);
})();


(() => {
    const map = getMapWithHorizontalAndVerticalLines();

    for (const line of diagonalLines) {
        const length = Math.abs(line.x2 - line.x1);
        const xIncrementFactor = line.x2 - line.x1 > 0 ? 1 : -1;
        const yIncrementFactor = line.y2 - line.y1 > 0 ? 1 : -1;

        for (let i = 0; i <= length; i++) {
            const x = line.x1 + i * xIncrementFactor;
            const y = line.y1 + i * yIncrementFactor;
            map.set(`${x},${y}`, (map.get(`${x},${y}`) ?? 0) + 1);
        }
    }

    const overlappingFieldCount = Array.from(map.values()).filter(n => n >= 2).length;
    console.log('PART 2:', overlappingFieldCount);
})();
