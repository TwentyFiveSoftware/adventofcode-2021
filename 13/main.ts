import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

interface Dot {
    x: number;
    y: number;
}

interface Fold {
    axis: string;
    n: number;
}

const [dotsSection, foldsSection] = input.split('\n\n');

const dots: Dot[] = dotsSection.split('\n').map(line => line.split(',')).map(([x, y]) =>
    ({ x: Number(x), y: Number(y) }));

const folds: Fold[] = foldsSection.split('\n').map(line => line.replace('fold along ', '')
    .split('=')).map(([axis, n]) => ({ axis, n: Number(n) }));


let paperWidth = Math.max(...dots.map(dot => dot.x)) + 1;
let paperHeight = Math.max(...dots.map(dot => dot.y)) + 1;

const fold = (fold: Fold) => {
    if (fold.axis === 'y') {
        for (const dot of dots) {
            if (dot.y <= fold.n)
                continue;

            dot.y = fold.n - (dot.y - fold.n);
        }

        paperHeight = Math.floor(paperHeight / 2);
    } else if (fold.axis === 'x') {
        for (const dot of dots) {
            if (dot.x <= fold.n)
                continue;

            dot.x = fold.n - (dot.x - fold.n);
        }

        paperWidth = Math.floor(paperWidth / 2);
    }
};

for (let i = 0; i < folds.length; i++) {
    fold(folds[i]);

    if (i === 0) {
        const visibleDots = new Set(dots.map(dot => `${dot.x},${dot.y}`)).size;
        console.log('PART 1:', visibleDots);
    }
}

const output: string[] = new Array(paperHeight).fill(new Array(paperWidth).fill('.').join(''));

for (const dot of dots)
    output[dot.y] = output[dot.y].substring(0, dot.x) + '#' + output[dot.y].substring(dot.x + 1);

const code: string = output.join('\n');

console.log('PART 2:');
console.log(code);
