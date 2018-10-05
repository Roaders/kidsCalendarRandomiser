import { Background, Fill, Thread, Cell } from "./types";
import { getRandomItem } from "./util";

const backgrounds: Background[] = ["Red", "Green", "Blue", "Purple", "Yellow", "Pink"];
const fills: Fill[] = ["Yellow", "Pink", "Red", "Green"];
const thread: Thread[] = ["Yellow", "Blue", "Red", "Green"];

export let unusedBackgrounds = backgrounds.map(b => [b, b, b, b])
    .reduce((all, current) => { all.push(...current); return all; }, []);

export let unusedFills = fills.map(f => [f, f, f, f, f, f])
    .reduce((all, current) => { all.push(...current); return all; }, []);

export let unusedThreads = thread.map(t => [t, t, t, t, t, t])
    .reduce((all, current) => { all.push(...current); return all; }, []);

function randomise<T>(input: T[]){
    const output: T[] = [];

    while(input.length > 0){
        const inputItem = getRandomItem(input);
        const outputIndex = Math.floor(Math.random()*output.length);
        output.splice(outputIndex, 0, inputItem);
    }

    return output;
}

unusedBackgrounds = randomise(unusedBackgrounds);
unusedFills = randomise(unusedFills);
unusedThreads = randomise(unusedThreads);

export function recycleRow(row: Cell[]) {
    //console.log(`recyling row`);
    row.forEach(recycleCell);
}

export function recycleCell(cell: Cell) {
    unusedBackgrounds.push(cell.background);
    unusedFills.push(cell.fill);
    unusedThreads.push(cell.thread);

    //console.log(`recyling cell B:${unusedBackgrounds.length} F:${unusedFills.length} T:${unusedThreads.length}`);
}
