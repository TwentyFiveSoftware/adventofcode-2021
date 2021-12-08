import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

const displays = input.split('\n').map(line =>
    line.split(' | ')
        .map(digits => digits.split(' ').map(digit => digit.split('').sort().join(''))),
);


(() => {
    const result = displays.map(([_, output]) =>
        output.map(o => o.length).filter(n => n === 2 || n === 3 || n === 4 || n === 7).length,
    ).reduce((sum, curr) => sum + curr, 0);

    console.log('PART 1:', result);
})();


const possibilities = new Array(7).fill(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

const getAllNumbersWithMapping = (mapping: string[][]) => {
    const [a, b, c, d, e, f, g] = possibilities.map((_, i) => mapping[i][0] ?? '-');

    return [
        [a, b, c, e, f, g],
        [c, f],
        [a, c, d, e, g],
        [a, c, d, f, g],
        [b, c, d, f],
        [a, b, d, f, g],
        [a, b, d, e, f, g],
        [a, c, f],
        [a, b, c, d, e, f, g],
        [a, b, c, d, f, g],
    ].map(number => number.sort().join(''));
};

const mapNumbersBackWithMapping = (numbers: string[], mapping: string[][]) => {
    const allNumbers = getAllNumbersWithMapping(mapping);
    return numbers.map(number => allNumbers.indexOf(number));
};


const checkVariant = (displayInput: string[], mapping: string[][]) =>
    JSON.stringify(getAllNumbersWithMapping(mapping).sort()) === JSON.stringify(displayInput.sort());


const tryVariant = (displayInput: string[], currentPossibilities: string[][]): string[][] | null => {
    const currentVariationIndex: number = currentPossibilities.findIndex(e => e.length > 1) ?? -1;
    if (currentVariationIndex === -1)
        return checkVariant(displayInput, currentPossibilities) ? currentPossibilities : null;

    for (let current of currentPossibilities[currentVariationIndex]) {
        let currentPossibilitiesCopy = [...currentPossibilities];

        for (let i = 0; i < currentPossibilitiesCopy.length; i++)
            currentPossibilitiesCopy[i] = currentPossibilitiesCopy[i].filter(e => e !== current);

        currentPossibilitiesCopy[currentVariationIndex] = [current];

        const result = tryVariant(displayInput, currentPossibilitiesCopy);
        if (result)
            return result;
    }

    return null;
};


const decodeDisplay = (display: string[][]) => {
    const [input, output] = display;

    const mapping = tryVariant(input, possibilities);
    if (!mapping)
        return 0;

    const decodedNumbers = mapNumbersBackWithMapping(output, mapping);
    return Number(decodedNumbers.join(''));
};


const result = displays.map(display => decodeDisplay(display)).reduce((sum, curr) => sum + curr, 0);
console.log('PART 2:', result);
