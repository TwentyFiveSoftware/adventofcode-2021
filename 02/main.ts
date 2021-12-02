import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();


(() => {
    interface Instruction {
        deltaHorizontal: number;
        deltaDepth: number;
    }

    interface Position {
        horizontal: number;
        depth: number;
    }

    const instructions: Instruction[] = input
        .split('\n')
        .map(line => line.split(' '))
        .map<Instruction>(([name, value]) => ({
            deltaHorizontal: name == 'forward' ? Number(value) : 0,
            deltaDepth: name == 'down' ? Number(value) : name == 'up' ? -Number(value) : 0,
        }));

    const position = instructions.reduce<Position>(((previousValue, currentValue) =>
        ({
            horizontal: previousValue.horizontal + currentValue.deltaHorizontal,
            depth: previousValue.depth + currentValue.deltaDepth,
        })), { horizontal: 0, depth: 0 });

    const part1Result = position.horizontal * position.depth;
    console.log('PART 1:', part1Result);
})();


(() => {
    interface Instruction {
        x: number;
        deltaAim: number;
    }

    interface Position {
        horizontal: number;
        depth: number;
        aim: number;
    }

    const instructions: Instruction[] = input
        .split('\n')
        .map(line => line.split(' '))
        .map<Instruction>(([name, value]) => ({
            x: name == 'forward' ? Number(value) : 0,
            deltaAim: name == 'down' ? Number(value) : name == 'up' ? -Number(value) : 0,
        }));

    const position = instructions.reduce<Position>(((previousValue, currentValue) =>
        ({
            horizontal: previousValue.horizontal + currentValue.x,
            depth: previousValue.depth + previousValue.aim * currentValue.x,
            aim: previousValue.aim + currentValue.deltaAim,
        })), { horizontal: 0, depth: 0, aim: 0 });

    const part2Result = position.horizontal * position.depth;
    console.log('PART 2:', part2Result);
})();
