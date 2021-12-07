import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const crabs = input.split(',').map(Number);

const crabsPerPosition = [...new Array(Math.max(...crabs) + 1).fill(0)]
    .map((_, i) => crabs.filter(crab => crab === i).length);


const calculateMinFuelCost = (fuelCostFn: (distance: number) => number) => {
    const fuelCost = crabsPerPosition
        .map((_, targetPos) => crabsPerPosition
            .map((count, pos) => fuelCostFn(Math.abs(pos - targetPos)) * count)
            .reduce((sum, curr) => sum + curr, 0),
        );

    return Math.min(...fuelCost);
};

const part1Result = calculateMinFuelCost(distance => distance);
console.log('PART 1:', part1Result);


const part2Result = calculateMinFuelCost(distance => (distance * distance + distance) / 2);
console.log('PART 2:', part2Result);
