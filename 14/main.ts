import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

const [polymerTemplate, rulesSection] = input.split('\n\n');

const rules = rulesSection.split('\n')
    .map(line => line.split(' -> '))
    .map(([pair, element]) => ({ pair, element }));


const simulateSteps = (steps: number): number => {
    let pairs = new Map<string, number>();

    for (let i = 0; i < polymerTemplate.length - 1; i++) {
        const pair = polymerTemplate.substring(i, i + 2);
        pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
    }

    const elementCount = new Map<string, number>();
    for (let i = 0; i < polymerTemplate.length; i++)
        elementCount.set(polymerTemplate.charAt(i), (elementCount.get(polymerTemplate.charAt(i)) ?? 0) + 1);


    for (let step = 1; step <= steps; step++) {
        const newPairs = new Map<string, number>(pairs);

        for (const [pair, count] of Array.from(pairs.entries())) {
            if (count <= 0) continue;

            const rule = rules.find(rule => rule.pair === pair);

            const element = rule?.element ?? '';
            const newPairA = pair.charAt(0) + element;
            const newPairB = element + pair.charAt(1);

            newPairs.set(pair, (newPairs.get(pair) ?? 1) - count);
            newPairs.set(newPairA, (newPairs.get(newPairA) ?? 0) + count);
            newPairs.set(newPairB, (newPairs.get(newPairB) ?? 0) + count);

            elementCount.set(element, (elementCount.get(element) ?? 0) + count);
        }

        pairs = newPairs;
    }

    const sortedElementCount = Array.from(elementCount.values()).sort((a, b) => a - b);
    return sortedElementCount[sortedElementCount.length - 1] - sortedElementCount[0];
};


console.log('PART 1:', simulateSteps(10));
console.log('PART 2:', simulateSteps(40));
