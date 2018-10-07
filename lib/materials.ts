import { Background, Fill, Thread, Cell } from "./types";
import { removeRandomItem, flatten } from "./util";

export const allBackgrounds: Background[] = ["Red", "Green", "Blue", "Purple", "Yellow", "Pink"];
export const allFills: Fill[] = ["Yellow", "Pink", "Red", "Green"];
export const allThreads: Thread[] = ["Yellow", "Blue", "Red", "Green"];

export type Materials = {
    backgrounds: Background[];
    fills: Fill[];
    threads: Thread[];
}

function randomise<T>(input: T[]) {
    const output: T[] = [];

    while (input.length > 0) {
        const inputItem = removeRandomItem(input);
        const outputIndex = Math.floor(Math.random() * output.length);
        output.splice(outputIndex, 0, inputItem);
    }

    return output;
}

export function generateMaterials(): Materials {
    let backgrounds = allBackgrounds.map(b => [b, b, b, b])
        .reduce(flatten, []);
    let fills = allFills.map(f => [f, f, f, f, f, f])
        .reduce(flatten, []);
    let threads = allThreads.map(t => [t, t, t, t, t, t])
        .reduce(flatten, []);

    backgrounds = randomise(backgrounds);
    fills = randomise(fills);
    threads = randomise(threads);

    return {backgrounds, fills, threads}
}

export function recycleRow(row: Cell[], materials: Materials) {
    row.forEach(cell => recycleCell(cell, materials));
}

export function recycleCell(cell: Cell, materials: Materials) {
    materials.backgrounds.push(cell.background);
    materials.fills.push(cell.fill);
    materials.threads.push(cell.thread);
}

let comboLookup: { [key: string]: number } = {};

export function lookupComboCount(cell: Cell) {
    return comboLookup[`${cell.background}_${cell.fill}`] | 0;
}

export function updateComboCount(cell: Cell, count: number) {
    comboLookup[`${cell.background}_${cell.fill}`] = count;
}

export function resetComboCount() {
    comboLookup = {};
}
