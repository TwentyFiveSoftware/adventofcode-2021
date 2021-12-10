import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const lines: string[][] = input.split('\n').map(line => line.split(''));


const calcLineSyntaxErrorScore = (line: number[]): number => {
    const stack: number[] = [];

    for (const bracket of line) {
        if (bracket > 0) {
            stack.unshift(bracket);
            continue;
        }

        if (stack[0] + bracket === 0)
            stack.shift();
        else
            return bracket;
    }

    return 0;
};

const calcLineAutocompleteScore = (line: number[]): number => {
    const stack: number[] = [];

    for (const bracket of line) {
        if (bracket > 0) {
            stack.unshift(bracket);
            continue;
        }

        if (stack[0] + bracket === 0)
            stack.shift();
        else
            break;
    }

    return stack.reduce((score, curr) => score * 5 + curr, 0);
};


(() => {
    const bracketMapping: { [key: string]: number } = {
        '(': 3, ')': -3, '[': 57, ']': -57, '{': 1197, '}': -1197, '<': 25137, '>': -25137,
    };

    const totalSyntaxErrorScore = lines
        .map(line => line.map(bracket => bracketMapping[bracket]))
        .map(calcLineSyntaxErrorScore).reduce((sum, curr) => sum + -curr, 0);

    console.log('PART 1:', totalSyntaxErrorScore);
})();

(() => {
    const bracketMapping: { [key: string]: number } = {
        '(': 1, ')': -1, '[': 2, ']': -2, '{': 3, '}': -3, '<': 4, '>': -4,
    };

    const autocompleteScores = lines
        .map(line => line.map(bracket => bracketMapping[bracket]))
        .filter(line => calcLineSyntaxErrorScore(line) === 0)
        .map(calcLineAutocompleteScore)
        .sort((a, b) => a - b);

    const result = autocompleteScores[Math.floor(autocompleteScores.length / 2)];
    console.log('PART 2:', result);
})();
