import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const smallRiskMap: number[][] = input.split('\n').map(line => line.split('').map(Number));

interface Vertex {
    x: number;
    y: number;
    risk: number;
    riskLevelSum: number;
}

const findLowestRiskPath = (riskMap: number[][]): number => {
    const vertices: Vertex[] = riskMap.map((row, y) => row.map((risk, x) =>
        ({ x, y, risk, riskLevelSum: Infinity }))).flat();

    const startVertex: Vertex | undefined = vertices.find((vertex) => vertex.x === 0 && vertex.y === 0);
    const endVertex: Vertex | undefined =
        vertices.find(vertex => vertex.y === riskMap.length - 1 && vertex.x === riskMap[vertex.y].length - 1);

    if (!startVertex || !endVertex)
        return -1;

    startVertex.riskLevelSum = 0;


    let verticesLeftToVisit = [...vertices];

    while (verticesLeftToVisit.length > 0) {
        const { x, y } = verticesLeftToVisit.filter(vertex => vertex.riskLevelSum !== Infinity)
            .sort((a, b) => a.riskLevelSum - b.riskLevelSum)[0];

        const currentVertex: Vertex | undefined = verticesLeftToVisit.find(vertex => vertex.x === x && vertex.y === y);
        if (!currentVertex)
            return -1;

        verticesLeftToVisit.splice(verticesLeftToVisit.indexOf(currentVertex), 1);

        if (currentVertex.x === endVertex.x && currentVertex.y === endVertex.y)
            break;

        for (const neighborPos of [{ x: x - 1, y: y }, { x: x + 1, y: y }, { x: x, y: y - 1 }, { x: x, y: y + 1 }])
            updateRiskLevelSum(currentVertex, neighborPos.x, neighborPos.y, verticesLeftToVisit);
    }

    return endVertex.riskLevelSum;
};

const updateRiskLevelSum = (vertex: Vertex, neighborX: number, neighborY: number, verticesLeftToVisit: Vertex[]) => {
    const neighborVertex: Vertex | undefined =
        verticesLeftToVisit.find(pos => pos.x === neighborX && pos.y === neighborY);

    if (!neighborVertex)
        return;

    const alternativeRiskLevelSum = vertex.riskLevelSum + neighborVertex.risk;
    if (alternativeRiskLevelSum < neighborVertex.riskLevelSum)
        neighborVertex.riskLevelSum = alternativeRiskLevelSum;
};


(() => {
    console.log('PART 1:', findLowestRiskPath(smallRiskMap));
})();

(() => {
    const toLargeRow = (row: number[], inc: number): number[] =>
        [row.map(r => r + inc), row.map(r => r + 1 + inc), row.map(r => r + 2 + inc), row.map(r => r + 3 + inc),
            row.map(r => r + 4 + inc)].flat().map(r => r > 9 ? r - 9 : r);

    const largeRiskMap =
        [smallRiskMap.map(r => toLargeRow(r, 0)), smallRiskMap.map(r => toLargeRow(r, 1)),
            smallRiskMap.map(r => toLargeRow(r, 2)), smallRiskMap.map(r => toLargeRow(r, 3)),
            smallRiskMap.map(r => toLargeRow(r, 4))].flat(1);

    console.log('PART 2:', findLowestRiskPath(largeRiskMap));
})();
