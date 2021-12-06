import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const initialFish = input.split(',').map(Number);

const getInitialFishCount = (days: number) => initialFish.filter(fish => fish === days).length;

const simulate = (days: number) => {
    let fish0: number = getInitialFishCount(0),
        fish1: number = getInitialFishCount(1),
        fish2: number = getInitialFishCount(2),
        fish3: number = getInitialFishCount(3),
        fish4: number = getInitialFishCount(4),
        fish5: number = getInitialFishCount(5),
        fish6: number = getInitialFishCount(6),
        fish7: number = getInitialFishCount(7),
        fish8: number = getInitialFishCount(8);

    for (let day = 1; day <= days; day++) {
        const newFishAmount: number = fish0;

        fish0 = fish1;
        fish1 = fish2;
        fish2 = fish3;
        fish3 = fish4;
        fish4 = fish5;
        fish5 = fish6;
        fish6 = fish7;
        fish7 = fish8;

        fish8 = newFishAmount;
        fish6 += newFishAmount;
    }

    return fish0 + fish1 + fish2 + fish3 + fish4 + fish5 + fish6 + fish7 + fish8;
};

console.log('PART 1:', simulate(80));
console.log('PART 2:', simulate(256));
