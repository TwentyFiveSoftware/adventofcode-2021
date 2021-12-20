import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const numbers: string[] = input.split('\n');

interface Value {
    id: number;
    value: number;
}

let id = 0;

const map = (n: never[]): never[] => {
    n[0] = (Array.isArray(n[0]) ? map(n[0]) : { id: id++, value: n[0] }) as never;
    n[1] = (Array.isArray(n[1]) ? map(n[1]) : { id: id++, value: n[1] }) as never;
    return n;
};

const parse = (n: string): never => map(JSON.parse(n)) as never;

const explode = (flatN: Value[], n: never[], depth: number = 0): { exploded: boolean, n: never[] } => {
    if (depth >= 4 && !Array.isArray(n[0]) && !Array.isArray(n[1])) {
        const left = n[0] as Value, right = n[1] as Value;

        const valueToLeft = flatN[flatN.findIndex(x => x.id === left.id) - 1];
        if (valueToLeft)
            valueToLeft.value += left.value;

        const valueToRight = flatN[flatN.findIndex(x => x.id === right.id) + 1];
        if (valueToRight)
            valueToRight.value += right.value;

        return { exploded: true, n: { id: left.id, value: 0 } as Value as never };
    }

    if (Array.isArray(n[0])) {
        const result = explode(flatN, n[0], depth + 1);
        n[0] = result.n as never;

        if (result.exploded)
            return { exploded: true, n };
    }

    if (Array.isArray(n[1])) {
        const result = explode(flatN, n[1], depth + 1);
        n[1] = result.n as never;

        if (result.exploded)
            return { exploded: true, n };
    }

    return { exploded: false, n };
};

const split = (n: never[]): { split: boolean, n: never[] } => {
    const splitValue = (value: Value): Value[] => [
        { id: value.id, value: Math.floor(value.value / 2) },
        { id: id++, value: Math.ceil(value.value / 2) },
    ];

    if (Array.isArray(n[0])) {
        const result = split(n[0]);
        if (result.split) {
            n[0] = result.n as never;
            return { split: true, n };
        }

    } else if ((n[0] as Value).value >= 10) {
        n[0] = splitValue(n[0]) as never;
        return { split: true, n };
    }

    if (Array.isArray(n[1])) {
        const result = split(n[1]);
        if (result.split) {
            n[1] = result.n as never;
            return { split: true, n };
        }

    } else if ((n[1] as Value).value >= 10) {
        n[1] = splitValue(n[1]) as never;
        return { split: true, n };
    }

    return { split: false, n };
};

const reduce = (n: never[]): never[] => {
    let explodeResult, splitResult;

    do {
        explodeResult = explode(n.flat(Number.MAX_VALUE), n);
        n = explodeResult.n;
        if (explodeResult.exploded)
            continue;

        splitResult = split(n);
        n = splitResult.n;
    } while (explodeResult?.exploded || splitResult?.split);

    return n;
};

const stringify = (n: never[]): string => {
    if (!Array.isArray(n))
        return (n as Value).value.toString();

    return `[${stringify(n[0])},${stringify(n[1])}]`;
};

const magnitude = (n: never[]): number => {
    if (!Array.isArray(n))
        return (n as Value).value;

    return 3 * magnitude(n[0]) + 2 * magnitude(n[1]);
};

const add = (a: never, b: never): never[] => reduce([a, b]);


(() => {
    let sum: never = parse(numbers[0]);

    for (let i = 1; i < numbers.length; i++)
        sum = add(sum, parse(numbers[i])) as never;

    const result = magnitude(sum);
    console.log('PART 1:', result);
})();

(() => {
    let maxMagnitude = 0;

    for (let i = 0; i < numbers.length - 1; i++)
        for (let j = i + 1; j < numbers.length; j++)
            maxMagnitude = Math.max(
                maxMagnitude,
                magnitude(add(parse(numbers[i]), parse(numbers[j]))),
                magnitude(add(parse(numbers[j]), parse(numbers[i]))),
            );

    console.log('PART 2:', maxMagnitude);
})();
