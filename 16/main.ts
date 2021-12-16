import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const binary: string = input.split('').map(hex =>
    parseInt(hex, 16).toString(2).padStart(4, '0')).join('');


interface Packet {
    version: number;
    type: number;
    length: number;
    literal: number;
    subPackets: Packet[];
}

const parsePacket = (bits: string): Packet => {
    const packet: Packet = {
        version: parseInt(bits.substring(0, 3), 2),
        type: parseInt(bits.substring(3, 6), 2),
        length: 6,
        literal: 0,
        subPackets: [],
    };

    if (packet.type === 4) {
        const { length, literal } = parseLiteral(bits.substring(6));
        packet.length += length;
        packet.literal = literal;

    } else {
        const { length, subPackets } = parseOperator(bits.substring(6));
        packet.length += length;
        packet.subPackets = subPackets;
    }

    return packet;
};

const parseLiteral = (literal: string): { length: number, literal: number } => {
    let number: string = '';
    let length: number = 0;

    for (let i = 0; i < literal.length; i += 5) {
        number += literal.substring(i + 1, i + 5);
        length += 5;

        if (literal.charAt(i) === '0')
            break;
    }

    return { literal: parseInt(number, 2), length };
};

const parseOperator = (operator: string): { length: number, subPackets: Packet[] } => {
    let subPackets: Packet[] = [];
    let length: number = 0;

    const lengthType = operator.charAt(0);

    if (lengthType === '0') {
        const subPacketLength = parseInt(operator.substring(1, 16), 2);
        length += 16;

        let parsedBits = 0;
        while (parsedBits < subPacketLength) {
            const subPacketBits = operator.substring(16 + parsedBits, 16 + subPacketLength);
            const subPacket = parsePacket(subPacketBits);
            subPackets.push(subPacket);
            parsedBits += subPacket.length;
        }

    } else {
        const subPacketCount = parseInt(operator.substring(1, 12), 2);
        length += 12;

        let parsedBits = 0;
        for (let i = 0; i < subPacketCount; i++) {
            const subPacketBits = operator.substring(12 + parsedBits);
            const subPacket = parsePacket(subPacketBits);
            subPackets.push(subPacket);
            parsedBits += subPacket.length;
        }
    }

    length += subPackets.reduce((sum, subPacket) => sum + subPacket.length, 0);

    return { subPackets, length };
};


const calculatePacketVersionSum = (packet: Packet): number => {
    return packet.version + packet.subPackets.reduce((sum, subPacket) =>
        sum + calculatePacketVersionSum(subPacket), 0);
};

const calculatePackageValue = (packet: Packet): number => {
    switch (packet.type) {
        case 0:
            return packet.subPackets.reduce((sum, subPacket) => sum + calculatePackageValue(subPacket), 0);
        case 1:
            return packet.subPackets.reduce((product, subPacket) => product * calculatePackageValue(subPacket), 1);
        case 2:
            return Math.min(...packet.subPackets.map(subPacket => calculatePackageValue(subPacket)));
        case 3:
            return Math.max(...packet.subPackets.map(subPacket => calculatePackageValue(subPacket)));
        case 4:
            return packet.literal;
        case 5:
            return calculatePackageValue(packet.subPackets[0]) > calculatePackageValue(packet.subPackets[1]) ? 1 : 0;
        case 6:
            return calculatePackageValue(packet.subPackets[0]) < calculatePackageValue(packet.subPackets[1]) ? 1 : 0;
        case 7:
            return calculatePackageValue(packet.subPackets[0]) === calculatePackageValue(packet.subPackets[1]) ? 1 : 0;
        default:
            return 0;
    }
};


console.log('PART 1:', calculatePacketVersionSum(parsePacket(binary)));
console.log('PART 2:', calculatePackageValue(parsePacket(binary)));
