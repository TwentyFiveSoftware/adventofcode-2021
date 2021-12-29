import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const seaCucumbers: string[][] = input.split('\n').map(l => l.split(''));


const clone = (a: string[][]): string[][] => JSON.parse(JSON.stringify(a));

const step = (cucumbers: string[][]): string[][] => {
    const height = cucumbers.length;
    const width = cucumbers[0].length;

    const nextCucumbers: string[][] = clone(cucumbers);

    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            if (cucumbers[y][x] === '>' && cucumbers[y][(x + 1) % width] === '.') {
                nextCucumbers[y][x] = '.';
                nextCucumbers[y][(x + 1) % width] = '>';
            }

    cucumbers = clone(nextCucumbers);

    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            if (cucumbers[y][x] === 'v' && cucumbers[(y + 1) % height][x] === '.') {
                nextCucumbers[y][x] = '.';
                nextCucumbers[(y + 1) % height][x] = 'v';
            }

    return nextCucumbers;
};

const changed = (a: string[][], b: string[][]): boolean => JSON.stringify(a) !== JSON.stringify(b);

const MAX_STEPS = 1000;

(() => {
    let current = seaCucumbers;

    for (let i = 1; i <= MAX_STEPS; i++) {
        const next = step(current);

        if (!changed(current, next)) {
            console.log('PART 1:', i);
            break;
        }

        current = next;
    }
})();
