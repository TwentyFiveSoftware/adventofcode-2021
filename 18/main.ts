import * as fs from 'fs';

const input: string = fs.readFileSync(`${__dirname}/input.txt`).toString();
const numbers: string[] = input.split('\n');


class BinaryTree {
    private left: BinaryTree | number = -1;
    private right: BinaryTree | number = -1;
    private readonly parent: BinaryTree | null = null;

    constructor(n: never, parent: BinaryTree | null = null) {
        this.parent = parent;
        this.left = isNaN(n[0]) ? new BinaryTree(n[0], this) : Number(n[0]);
        this.right = isNaN(n[1]) ? new BinaryTree(n[1], this) : Number(n[1]);
    }

    private getLeftTree(): BinaryTree | null {
        return (this.left instanceof BinaryTree) ? (this.left as BinaryTree) : null;
    }

    private getRightTree(): BinaryTree | null {
        return (this.right instanceof BinaryTree) ? (this.right as BinaryTree) : null;
    }

    public explode(depth: number = 0): boolean {
        if (depth >= 4) {
            this.explodeAddToLeft();
            this.explodeAddToRight();
            this.explodeReplaceWithZero();
            return true;
        }

        if (this.getLeftTree()?.explode(depth + 1))
            return true;

        if (this.getRightTree()?.explode(depth + 1))
            return true;

        return false;
    }

    private explodeAddToLeft() {
        if (this.parent?.getRightTree() === this) {
            if (this.parent?.getLeftTree() === null)
                (this.parent.left as number) += (this.left as number);
            else
                this.parent?.getLeftTree()?.addToMostRightNumber(this.left as number);
            return;
        }

        let p = this.parent;
        let lastNode: BinaryTree = this;

        while (p !== null) {
            if (p.getRightTree() === lastNode) {
                if (p.getLeftTree() === null)
                    (p.left as number) += (this.left as number);
                else
                    p.getLeftTree()?.addToMostRightNumber(this.left as number);

                break;
            }

            lastNode = p;
            p = p.parent;
        }
    }

    private explodeAddToRight() {
        if (this.parent?.getLeftTree() === this) {
            if (this.parent?.getRightTree() === null)
                (this.parent.right as number) += (this.right as number);
            else
                this.parent?.getRightTree()?.addToMostLeftNumber(this.right as number);
            return;
        }

        let p = this.parent;
        let lastNode: BinaryTree = this;

        while (p !== null) {
            if (p.getLeftTree() === lastNode) {
                if (p.getRightTree() === null)
                    (p.right as number) += (this.right as number);
                else
                    p.getRightTree()?.addToMostLeftNumber(this.right as number);

                break;
            }

            lastNode = p;
            p = p.parent;
        }
    }

    private addToMostLeftNumber(n: number) {
        if (this.getLeftTree() !== null)
            this.getLeftTree()?.addToMostLeftNumber(n);
        else
            (this.left as number) += n;
    }

    private addToMostRightNumber(n: number) {
        if (this.getRightTree() !== null)
            this.getRightTree()?.addToMostRightNumber(n);
        else
            (this.right as number) += n;
    }

    private explodeReplaceWithZero() {
        if (this.parent !== null)
            if (this.parent?.getRightTree() === this)
                this.parent.right = 0;
            else
                this.parent.left = 0;
    }

    public split(): boolean {
        if (this.getLeftTree()?.split())
            return true;

        if (this.getRightTree()?.split())
            return true;

        if (this.left >= 10) {
            this.left = new BinaryTree(
                [Math.floor((this.left as number) / 2), Math.ceil((this.left as number) / 2)] as never, this);
            return true;

        } else if (this.right >= 10) {
            this.right = new BinaryTree(
                [Math.floor((this.right as number) / 2), Math.ceil((this.right as number) / 2)] as never, this);
            return true;
        }

        return false;
    }

    public stringify(): string {
        const left = this.getLeftTree()?.stringify() ?? this.left;
        const right = this.getRightTree()?.stringify() ?? this.right;
        return `[${left},${right}]`;
    }

    public magnitude(): number {
        const left: number = this.getLeftTree()?.magnitude() ?? Number(this.left);
        const right: number = this.getRightTree()?.magnitude() ?? Number(this.right);
        return left * 3 + right * 2;
    }
}

const reduceTree = (tree: BinaryTree) => {
    let current: string = tree.stringify();

    do {
        current = tree.stringify();

        if (tree.explode())
            continue;

        tree.split();
    } while (current !== tree.stringify());
};

const addNumbers = (n1: string, n2: string): string => {
    const tree = new BinaryTree([JSON.parse(n1), JSON.parse(n2)] as never);
    reduceTree(tree);
    return tree.stringify();
};


(() => {
    let result: string = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        result = addNumbers(result, numbers[i]);
    }

    const magnitude = new BinaryTree(JSON.parse(result) as never).magnitude();
    console.log('PART 1:', magnitude);
})();

(() => {
    let largestMagnitude = 0;

    for (let i = 0; i < numbers.length; i++)
        for (let j = 0; j < numbers.length; j++) {
            if (i === j) continue;

            const magnitude = new BinaryTree(JSON.parse(addNumbers(numbers[i], numbers[j])) as never).magnitude();
            if (magnitude > largestMagnitude)
                largestMagnitude = magnitude;
        }

    console.log('PART 2:', largestMagnitude);
})();
