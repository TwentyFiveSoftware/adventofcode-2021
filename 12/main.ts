import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();

interface Path {
    a: string;
    b: string;
}

const paths: Path[] = input
    .split('\n')
    .map(line => line.split('-'))
    .map(([a, b]) => ({ a, b }));


const nodes: string[] = [];

for (const path of paths) {
    if (!nodes.includes(path.a))
        nodes.push(path.a);

    if (!nodes.includes(path.b))
        nodes.push(path.b);
}


const findPaths = (fromNode: string, visitedNodes: string[] = []): string[][] => {
    if (fromNode === 'end')
        return [['end']];

    const adjacentNodes = [
        ...paths.filter(path => path.a === fromNode).map(path => path.b),
        ...paths.filter(path => path.b === fromNode).map(path => path.a),
    ].filter(node => node !== 'start' && (node.toLowerCase() !== node || !visitedNodes.includes(node)));

    let foundPaths: string[][] = [];

    for (const toNode of adjacentNodes) {
        for (const p of findPaths(toNode, [...visitedNodes, fromNode])) {
            foundPaths.push([fromNode, ...p]);
        }
    }

    return foundPaths;
};


const findPaths2 = (fromNode: string, visitedNodes: string[] = [], doubleVisited: boolean = false): string[][] => {
    if (fromNode === 'end')
        return [['end']];

    const adjacentNodes = [
        ...paths.filter(path => path.a === fromNode).map(path => path.b),
        ...paths.filter(path => path.b === fromNode).map(path => path.a),
    ].filter(node => node !== 'start');

    let foundPaths: string[][] = [];

    for (const toNode of adjacentNodes) {
        let doubleVisit = doubleVisited;

        if (toNode.toLowerCase() === toNode && visitedNodes.includes(toNode)) {
            if (doubleVisited)
                continue;

            doubleVisit = true;
        }

        for (const p of findPaths2(toNode, [...visitedNodes, fromNode], doubleVisit)) {
            foundPaths.push([fromNode, ...p]);
        }
    }

    return foundPaths;
};


(() => {
    const distinctPaths = findPaths('start').length;
    console.log('PART 1:', distinctPaths);
})();


(() => {
    const distinctPaths = findPaths2('start').length;
    console.log('PART 2:', distinctPaths);
})();
