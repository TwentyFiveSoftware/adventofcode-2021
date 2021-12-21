import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const startingPositions: number[] = input.split('\n').map(line => Number(line.split(': ')[1]));


const playPracticeGame = () => {
    let playerPositions: number[] = [...startingPositions];
    let playerScores: number[] = [0, 0];
    let playersTurn: number = 0;

    let diceRolled = 0;

    const rollDice = (): number => (diceRolled++) % 100 + 1;

    const turn = () => {
        const dice = rollDice() + rollDice() + rollDice();
        playerPositions[playersTurn] = (playerPositions[playersTurn] + dice - 1) % 10 + 1;
        playerScores[playersTurn] += playerPositions[playersTurn];
    };

    while (Math.max(...playerScores) < 1000) {
        turn();
        playersTurn = (playersTurn + 1) % 2;
    }

    return Math.min(...playerScores) * diceRolled;
};

const playRealGame = () => {
    let playerWins: number[] = [0, 0];
    const waysToRollDiceValue = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];

    const playGameTurn = (playerPositions: number[], playerScores: number[] = [0, 0], playersTurn: number = 1,
                          rolledDice: number = -1, waysToReachThisState: number = 1) => {
        if (rolledDice !== -1) {
            playerPositions[playersTurn] = (playerPositions[playersTurn] + rolledDice - 1) % 10 + 1;
            playerScores[playersTurn] += playerPositions[playersTurn];
        }

        const ways = waysToReachThisState * (waysToRollDiceValue[rolledDice] ?? 1);

        if (playerScores[playersTurn] >= 21) {
            playerWins[playersTurn] += ways;
            return;
        }

        for (let rolledDice = 3; rolledDice <= 9; rolledDice++)
            playGameTurn([...playerPositions], [...playerScores], 1 - playersTurn, rolledDice, ways);
    };

    playGameTurn([...startingPositions]);

    return Math.max(...playerWins);
};


console.log('PART 1:', playPracticeGame());
console.log('PART 2:', playRealGame());
