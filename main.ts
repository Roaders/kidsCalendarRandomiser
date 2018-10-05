import "colors";

import {
    Thread, 
    Background, 
    Grid, 
    Cell, 
    Fill, 
    Row
} from "./lib/types";
import { displayGrid } from "./lib/display";
import { unusedBackgrounds, unusedFills, unusedThreads, recycleRow, recycleCell } from "./lib/data";
import { getRandomItem } from "./lib/util";

function generateGrid(): Grid | null {

    console.log(`Generating grid B:${unusedBackgrounds.length} F:${unusedFills.length} T:${unusedThreads.length}`);

    comboLookup = {};

    const rows: Row[] = [];

    let previousRow: Row | undefined;

    while (rows.length < 6) {
        const row = generateRow();

        if (!row) {
            console.log(`Recycling Grid null row`);
            rows.forEach(recycleRow);
            return null
        }

        if(row.some((cell, index) => previousRow != null && previousRow[index].background === cell.background)){

            console.log(`Recycling Grid row background clash`);
            rows.forEach(recycleRow);
            recycleRow(row);
            return null
        }

        if (row) {
            rows.push(row);
        }

        previousRow = row;
    }

    return rows as Grid;
}

function generateRow(): Row | null {
    const cells: Cell[] = [];

    while (cells.length < 4) {
        const cell = generateCell();


        if (cell == null) {
            console.log(`rejecting row (null cell)`);
            recycleRow(cells);

            return null;
        }

        if (cells.some(c => c.background === cell.background)) {
            console.log(`rejecting row (duplicate backgrounds)`);
            recycleCell(cell);
            recycleRow(cells);

            return null;
        }

        if (cell) {
            cells.push(cell);
        }
    }

    return cells as Row;
}

function validateCellColor(color: Fill | Thread, background: Background): boolean {
    return color != background;
}

let comboLookup: {[key: string]: number} = {};

function lookupComboCount(cell: Cell){
    return comboLookup[`${cell.background}_${cell.fill}`] | 0;
}

function updateComboCount(cell: Cell, count: number){
    comboLookup[`${cell.background}_${cell.fill}`] = count;
}

function generateCell(): Cell | null {

    if ([unusedBackgrounds, unusedFills, unusedThreads].some(colors => colors.length === 0)) {
        throw new Error('No colors left');
    }

    const background = getRandomItem(unusedBackgrounds);

    if (!unusedFills.some(f => f !== background) || !unusedThreads.some(t => t !== background)) {
        console.log(`No matching colors (F:${unusedThreads.join(",")}, T:${unusedFills.join(",")}) for background (${background})`);
        unusedBackgrounds.push(background);
        return null;
    }

    let fill = getRandomItem(unusedFills);

    while (!validateCellColor(fill, background)) {
        console.log(`Reject fill ${fill} on ${background}`);

        unusedFills.push(fill);
        fill = getRandomItem(unusedFills);
    }

    let thread = getRandomItem(unusedThreads);

    while (!validateCellColor(thread, background)) {
        console.log(`Reject thread ${thread} on ${background}`);

        unusedThreads.push(thread);
        thread = getRandomItem(unusedThreads);
    }

    const cell: Cell = {
        background,
        fill,
        thread
    };

    if(lookupComboCount(cell) >= 2){
        console.log(`Reject cell, too many combos`);
        recycleCell(cell);
        return null;
    }

    updateComboCount(cell, lookupComboCount(cell) + 1)

    return cell;
}

let grid = generateGrid();

let gridCount = 1;

while (grid == null) {
    console.log(`Attempt: ${gridCount}`)
    grid = generateGrid();
    gridCount++;
}

displayGrid(grid);
