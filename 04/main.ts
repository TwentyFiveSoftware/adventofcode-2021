import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const lines = input.split('\n');

const numbers = lines[0].split(',').map(Number);

const boards: number[][] = lines
    .slice(2)
    .map(l => l === '' ? ';' : l)
    .join(' ')
    .split(';')
    .map(l => l.trim().replace(/ +/g, ' ').split(' ').map(Number));


const hasBoardWon = (board: number[]) => {
    for (let row = 0; row < 5; row++)
        if (board.slice(row * 5, row * 5 + 5).filter(n => n !== -1).length === 0)
            return true;

    for (let column = 0; column < 5; column++)
        if ([board[column], board[column + 5], board[column + 10], board[column + 15], board[column + 20]]
            .filter(n => n !== -1).length === 0)
            return true;

    return false;
};


(() => {
    let boardsCopy = [...boards];
    let result = 0;

    for (const number of numbers) {
        boardsCopy = boardsCopy.map(board => board.map(n => n === number ? -1 : n));

        for (const board of boardsCopy) {
            if (!hasBoardWon(board)) continue;

            const unmarkedSum = board.filter(n => n !== -1).reduce((sum, curr) => sum + curr, 0);
            result = number * unmarkedSum;
            break;
        }

        if (result !== 0) break;
    }

    console.log('PART 1:', result);
})();


(() => {
    let boardsCopy = [...boards];
    let result = 0;

    for (const number of numbers) {
        boardsCopy = boardsCopy.map(board => board.map(n => n === number ? -1 : n));

        const currentWinners = boardsCopy.filter(board => hasBoardWon(board));
        boardsCopy = boardsCopy.filter(board => !hasBoardWon(board));

        if (boardsCopy.length === 0 && currentWinners.length === 1) {
            const unmarkedSum = currentWinners[0].filter(n => n !== -1).reduce((sum, curr) => sum + curr, 0);
            result = number * unmarkedSum;
            break;
        }
    }

    console.log('PART 2:', result);
})();
