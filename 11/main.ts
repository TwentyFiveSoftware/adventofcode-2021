import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const startGrid: number[][] = input.split('\n').map(line => line.split('').map(Number));

let grid: number[][];

const flash = (x: number, y: number) => {
    for (let Y = Math.max(0, y - 1); Y <= Math.min(y + 1, grid.length - 1); Y++)
        for (let X = Math.max(0, x - 1); X <= Math.min(x + 1, grid[Y].length - 1); X++)
            grid[Y][X]++;

    grid[y][x] = -Infinity;
};

const simulateStep = (): number => {
    grid = grid.map(line => line.map(energy => energy + 1));

    let flashes = 0;
    do {
        for (let y = 0; y < grid.length; y++)
            for (let x = 0; x < grid[y].length; x++)
                if (grid[y][x] > 9) {
                    flash(x, y);
                    flashes++;
                }
    } while (grid.some(line => line.some(energy => energy > 9)));

    grid = grid.map(line => line.map(energy => energy < 0 ? 0 : energy));
    return flashes;
};


(() => {
    grid = JSON.parse(JSON.stringify(startGrid));

    let totalFlashes = 0;

    for (let step = 1; step <= 100; step++)
        totalFlashes += simulateStep();

    console.log('PART 1:', totalFlashes);
})();

(() => {
    grid = JSON.parse(JSON.stringify(startGrid));

    let step = 0;

    while (true) {
        step++;

        if (simulateStep() === 100)
            break;
    }

    console.log('PART 2:', step);
})();
