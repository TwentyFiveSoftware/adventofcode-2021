import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const [algorithm, imageString]: string[] = input.split('\n\n');

const startImage: number[][] = imageString.split('\n')
    .map(line => line.split('').map(p => p === '#' ? 1 : 0));

let currentDefault: string = '0';

const applyAlgorithm = (image: number[][]): number[][] => {
    const imageHeight = image.length;
    const imageWidth = image[0].length;

    let result: number[][] = [];

    for (let y = -1; y < imageHeight + 1; y++) {
        result[y + 1] = [];

        for (let x = -1; x < imageWidth + 1; x++) {
            let binary: string = '';

            for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++)
                    binary += !image[y + dy] ? currentDefault : image[y + dy][x + dx]?.toString() ?? currentDefault;

            result[y + 1][x + 1] = algorithm.charAt(parseInt(binary, 2)) === '#' ? 1 : 0;
        }
    }

    currentDefault = (currentDefault === '0' ? algorithm.charAt(0) : algorithm.charAt(2 ** 9 - 1)) === '#' ? '1' : '0';

    return result;
};

const countLitPixels = (image: number[][]): number => image.reduce((sum, line) =>
    sum + line.reduce((lineSum, pixel) => lineSum + pixel), 0);

const visualizeImage = (image: number[][]): string =>
    image.map(line => line.map(p => p === 1 ? '#' : '.').join('')).join('\n');

const applyPadding = (image: number[][], padding: number): number[][] => {
    const imageHeight = image.length;
    const imageWidth = image[0].length;

    let result: number[][] = [];

    for (let y = -padding; y < imageHeight + padding; y++) {
        result[y + padding] = [];

        for (let x = -padding; x < imageWidth + padding; x++)
            result[y + padding][x + padding] = !image[y] ? 0 : image[y][x] ?? 0;
    }

    return result;
};


(() => {
    const litPixels = countLitPixels(applyAlgorithm(applyAlgorithm(applyPadding(startImage, 5))));
    console.log('PART 1:', litPixels);
})();

(() => {
    let image: number[][] = applyPadding(startImage, 5);

    for (let timesApplied = 0; timesApplied < 50; timesApplied++)
        image = applyAlgorithm(image);

    console.log('PART 2:', countLitPixels(image));
})();
