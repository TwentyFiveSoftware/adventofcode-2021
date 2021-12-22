import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();


interface Vector {
    x: number;
    y: number;
    z: number;
}

interface Cuboid {
    count: number;
    lowerCorner: Vector;
    upperCorner: Vector;
}


const doCuboidsIntersect = (a: Cuboid, b: Cuboid): boolean =>
    (a.upperCorner.x >= b.lowerCorner.x && a.lowerCorner.x <= b.upperCorner.x) &&
    (a.upperCorner.y >= b.lowerCorner.y && a.lowerCorner.y <= b.upperCorner.y) &&
    (a.upperCorner.z >= b.lowerCorner.z && a.lowerCorner.z <= b.upperCorner.z);

const buildIntersectingCuboid = (a: Cuboid, b: Cuboid): Cuboid =>
    ({
        count: -b.count,
        lowerCorner: {
            x: Math.max(a.lowerCorner.x, b.lowerCorner.x),
            y: Math.max(a.lowerCorner.y, b.lowerCorner.y),
            z: Math.max(a.lowerCorner.z, b.lowerCorner.z),
        },
        upperCorner: {
            x: Math.min(a.upperCorner.x, b.upperCorner.x),
            y: Math.min(a.upperCorner.y, b.upperCorner.y),
            z: Math.min(a.upperCorner.z, b.upperCorner.z),
        },
    });


const calculateCuboidVolume = (cuboid: Cuboid): number =>
    (cuboid.upperCorner.x - cuboid.lowerCorner.x + 1) *
    (cuboid.upperCorner.y - cuboid.lowerCorner.y + 1) *
    (cuboid.upperCorner.z - cuboid.lowerCorner.z + 1);

const countOnCuboids = (cuboids: Cuboid[]): number => cuboids
    .map(cuboid => calculateCuboidVolume(cuboid) * cuboid.count)
    .reduce((count, value) => count + value, 0);

const countOnCuboidsInRange = (cuboids: Cuboid[], min: number, max: number): number => cuboids
    .filter(cuboid => doCuboidsIntersect(cuboid,
        { count: 0, lowerCorner: { x: min, y: min, z: min }, upperCorner: { x: max, y: max, z: max } }))
    .map(cuboid => calculateCuboidVolume(cuboid) * cuboid.count)
    .reduce((count, value) => count + value, 0);


(() => {
    const cuboids: Cuboid[] = input.split('\n').map(line => (line.match(
        /^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)$/) ?? []))
        .map(([_, onOrOff, x1, x2, y1, y2, z1, z2]) => ({
                count: onOrOff === 'on' ? 1 : -1,
                lowerCorner: { x: Number(x1), y: Number(y1), z: Number(z1) },
                upperCorner: { x: Number(x2), y: Number(y2), z: Number(z2) },
            }),
        );

    const existingCuboids: Cuboid[] = [];

    for (const cuboid of cuboids) {
        for (const existingCuboid of [...existingCuboids])
            if (doCuboidsIntersect(cuboid, existingCuboid))
                existingCuboids.push(buildIntersectingCuboid(cuboid, existingCuboid));

        if (cuboid.count > 0)
            existingCuboids.push(cuboid);
    }

    console.log('PART 1:', countOnCuboidsInRange(existingCuboids, -50, 50));
    console.log('PART 2:', countOnCuboids(existingCuboids));
})();
