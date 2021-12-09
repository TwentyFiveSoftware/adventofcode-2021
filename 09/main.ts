import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const heightMap: number[][] = input.split('\n').map(line => line.split('').map(Number));

interface Location {
    x: number;
    y: number;
}

const findLowPoints = (): Location[] => {
    const lowPoints: Location[] = [];

    for (let y = 0; y < heightMap.length; y++) {
        for (let x = 0; x < heightMap[y].length; x++) {
            const current = heightMap[y][x];
            const up = y > 0 ? heightMap[y - 1][x] : 9;
            const down = y < heightMap.length - 1 ? heightMap[y + 1][x] : 9;
            const left = x > 0 ? heightMap[y][x - 1] : 9;
            const right = x < heightMap[y].length - 1 ? heightMap[y][x + 1] : 9;

            if (current < Math.min(up, down, left, right))
                lowPoints.push({ x, y });
        }
    }

    return lowPoints;
};

const findBasin = (location: Location, checkedLocations: Location[] = []): Location[] => {
    checkedLocations.push(location);
    const { x, y } = location;

    if (x < 0 || y < 0 || y >= heightMap.length || x >= heightMap[y].length || heightMap[y][x] >= 9)
        return [];

    const result: Location[] = [location];

    if (!checkedLocations.some(loc => loc.x === x && loc.y === y - 1))
        result.push(...findBasin({ x, y: y - 1 }, checkedLocations));

    if (!checkedLocations.some(loc => loc.x === x && loc.y === y + 1))
        result.push(...findBasin({ x, y: y + 1 }, checkedLocations));

    if (!checkedLocations.some(loc => loc.x === x - 1 && loc.y === y))
        result.push(...findBasin({ x: x - 1, y }, checkedLocations));

    if (!checkedLocations.some(loc => loc.x === x + 1 && loc.y === y))
        result.push(...findBasin({ x: x + 1, y }, checkedLocations));

    return result;
};


(() => {
    const riskLevel = findLowPoints().reduce((sum, curr) => sum + heightMap[curr.y][curr.x] + 1, 0);
    console.log('PART 1:', riskLevel);
})();

(() => {
    const lowPoints = findLowPoints();

    const basins = lowPoints.map(lowPoint => findBasin(lowPoint).length);
    const largestBasins = basins.sort((a, b) => b - a).slice(0, 3);

    const result = largestBasins.reduce((product, curr) => product * curr, 1);
    console.log('PART 2:', result);
})();
