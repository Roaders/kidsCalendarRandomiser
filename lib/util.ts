import { Grid, Row, Cell } from "./types";

export function removeRandomItem<T>(items: T[]): T
export function removeRandomItem<T>(items: T[], disallowedItems: unknown[] | unknown): T | null
export function removeRandomItem<T>(items: T[], disallowedItems?: unknown[] | unknown): T | null {

    if(items == null){
        throw new Error(`Null array passed to removeRandomItem`);
    }

    let blacklist: unknown[] | undefined = undefined;

    if(disallowedItems){
        blacklist= disallowedItems instanceof Array ? disallowedItems : [disallowedItems];
    }

    if(!items.some(item => !blacklist || blacklist.indexOf(item) < 0)){
        return null;
    }

    let randomIndex = getRandomIndex(items);

    while(blacklist && blacklist.some(black => black === items[randomIndex])){
        let indexes = items.map((_, index) => index)
        indexes.splice(randomIndex, 1);
        
        randomIndex = removeRandomItem(indexes);
    }

    return items.splice(randomIndex, 1)[0];
}

export function getRandomItem<T>(items: T[]): T {

    if(items == null){
        throw new Error(`Null array passed to getRandomItem`);
    }

    return items[getRandomIndex(items)];
}

function getRandomIndex(items: Array<unknown>){
    return Math.floor(items.length * Math.random());
}

export function flatten<T>(all: T[], current: T[]): T[]{
    all.push(...current);
    return all;
}

export function getMax<T>(currentMax: number, current: number): number{
    return Math.max(currentMax, current);
}

export function count<T>(items: T[], predicate: (item: T) => boolean){
    return items.reduce((count, item) => predicate(item) ? ++count : count,0);
}

export function sumScore(score: number, currentScore: number): number {
    return score + currentScore;
}

export function stringifyGrid(grid: Grid): string{
    return grid.map(stringifyRow).join(",");
}

export function stringifyRow(row: Row): string{
    return `[${row.map(stringifyCell).join(",")}]`
}

export function stringifyCell(cell: Cell): string{
    return `{B:${cell.background},F:${cell.fill},T:${cell.thread}}`;
}

export function createNullArray(length: number){
    return Array.from<null>(Array(length));
}

export function isDefined<T>(input: T | null | undefined): input is T{
    return input != null;
}

function consecutiveMatchingNumbers<T>(matches: T[], currentValue: T, comparison: T): T[]{
    if(currentValue === comparison){
        matches.push(currentValue);
    } else {
        matches = [];
    }
    return matches;

}

export function highScoreNoLongerChanging(highScores: number[], generationCount: number): boolean{
    const highScore = highScores.reduce(getMax, 0);

    const lastHighScores = highScores.reduce<number[]>((scores, score) => consecutiveMatchingNumbers(scores, score, highScore), []);

    return lastHighScores.length >= generationCount;
}
