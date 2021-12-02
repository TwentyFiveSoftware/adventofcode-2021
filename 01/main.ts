import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const numbers: number[] = input.split('\n').map(Number);


const increasedNumberReducer = (previousValue: number, currentValue: number, currentIndex: number, currentArray: number[]) =>
    previousValue + (currentArray[currentIndex - 1] < currentValue ? 1 : 0);


// PART 1
const increasedMeasurements = numbers.reduce(increasedNumberReducer, 0);

console.log('PART 1:', increasedMeasurements);


// PART 2
const increasedMeasurementSums = numbers
    .map((n, i) => n + numbers[i + 1] + numbers[i + 2])
    .filter(n => !isNaN(n))
    .reduce(increasedNumberReducer, 0);

console.log('PART 2:', increasedMeasurementSums);
