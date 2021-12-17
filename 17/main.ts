import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

const [minX, maxX, minY, maxY] = input.replace(/(target area:)|x=|y=| /g, '').split(',')
    .map(axis => axis.split('..').map(Number)).flat();

const MAX_STEPS = 5000;
const VELOCITY_SEARCH_RANGE = 5000;

const doesStartingVelocityHitTarget = (xVelocity: number, yVelocity: number): { hit: boolean, highestY: number } => {
    let x = 0, y = 0;
    let highestY = 0;

    for (let step = 1; step <= MAX_STEPS; step++) {
        x += xVelocity;
        y += yVelocity;

        if (xVelocity > 0)
            xVelocity--;
        else if (xVelocity < 0)
            xVelocity++;

        yVelocity--;

        if (y > highestY)
            highestY = y;

        if ((maxX > 0 && x > maxX) || (minX < 0 && x < minX) || y < minY)
            break;

        if (x >= minX && x <= maxX && y >= minY && y <= maxY)
            return { hit: true, highestY };
    }

    return { hit: false, highestY };
};

const findStartingVelocityWithHighestY = (): number => {
    let maxHighestY = 0;

    let minVelocityX = minX > 0 ? 0 : -VELOCITY_SEARCH_RANGE;
    let maxVelocityX = minVelocityX < 0 ? 0 : VELOCITY_SEARCH_RANGE;

    for (let xVelocity = minVelocityX; xVelocity <= maxVelocityX; xVelocity++) {
        let currHighestY = maxHighestY;

        for (let yVelocity = VELOCITY_SEARCH_RANGE; yVelocity >= 0; yVelocity--) {
            const { hit, highestY } = doesStartingVelocityHitTarget(xVelocity, yVelocity);
            if (!hit)
                continue;

            if (maxHighestY < highestY)
                maxHighestY = highestY;
            else
                break;
        }

        if (currHighestY < maxHighestY)
            break;
    }

    return maxHighestY;
};

const findAllStartingVelocities = (): number => {
    let count = 0;

    let minVelocityX = minX > 0 ? 0 : -VELOCITY_SEARCH_RANGE;
    let maxVelocityX = minVelocityX < 0 ? 0 : VELOCITY_SEARCH_RANGE;

    for (let xVelocity = minVelocityX; xVelocity <= maxVelocityX; xVelocity++)
        for (let yVelocity = -VELOCITY_SEARCH_RANGE; yVelocity <= VELOCITY_SEARCH_RANGE; yVelocity++)
            if (doesStartingVelocityHitTarget(xVelocity, yVelocity).hit)
                count++;

    return count;
};


console.log('PART 1:', findStartingVelocityWithHighestY());
console.log('PART 2:', findAllStartingVelocities());
