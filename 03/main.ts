import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

const numbers = input.split('\n').map(line => line.split('').map(Number));
const numberLength = numbers[0].length;

const getMostCommonBits = (numberArray: number[][]) => {
    const sums = numberArray.reduce<number[]>((previousValue, currentValue) =>
            previousValue.map((value, index) => value + currentValue[index]),
        new Array(numberLength).fill(0));

    return sums.map(sum => sum >= (numberArray.length / 2) ? 1 : 0);
};


(() => {
    const gammaRate = parseInt(getMostCommonBits(numbers).join(''), 2);
    const epsilonRate = Math.pow(2, numberLength) - 1 - gammaRate;

    const part1Result = gammaRate * epsilonRate;
    console.log('PART 1:', part1Result);
})();


(() => {
    // oxygen generator rating
    let possibleNumbers = numbers;

    for (let i = 0; i < numberLength; i++) {
        const mostCommonBits = getMostCommonBits(possibleNumbers);
        possibleNumbers = possibleNumbers.filter(number => number[i] == mostCommonBits[i]);

        if (possibleNumbers.length === 1) break;
    }

    const oxygenGeneratorRating = parseInt(possibleNumbers[0].join(''), 2);


    // co2 scrubber rating
    possibleNumbers = numbers;

    for (let i = 0; i < numberLength; i++) {
        const mostCommonBits = getMostCommonBits(possibleNumbers);
        const leastCommonBits = mostCommonBits.map(bit => 1 - bit);
        possibleNumbers = possibleNumbers.filter(number => number[i] == leastCommonBits[i]);

        if (possibleNumbers.length === 1) break;
    }

    const co2ScrubberRating = parseInt(possibleNumbers[0].join(''), 2);


    // result
    const part2Result = oxygenGeneratorRating * co2ScrubberRating;
    console.log('PART 2:', part2Result);
})();
