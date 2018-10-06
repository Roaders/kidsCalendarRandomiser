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
import formatDuration from "format-duration";

function generateGrid(): Grid | null {

    console.log(`Generating grid B:${unusedBackgrounds.length} F:${unusedFills.length} T:${unusedThreads.length}`);

    comboLookup = {};

    const rows: Row[] = [];

    let previousRow: Row | undefined;

    while (rows.length < 6) {
        const row = generateRow(previousRow);

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

function generateRow(previousRow?: Row): Row | null {
    const cells: Cell[] = [];

    while (cells.length < 4) {
        const cell = generateCell(previousRow ? previousRow[cells.length].background : undefined);

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

let comboLookup: {[key: string]: number} = {};

function lookupComboCount(cell: Cell){
    return comboLookup[`${cell.background}_${cell.fill}`] | 0;
}

function updateComboCount(cell: Cell, count: number){
    comboLookup[`${cell.background}_${cell.fill}`] = count;
}

function generateCell(disallowedBackground?: Background): Cell | null {

    if ([unusedBackgrounds, unusedFills, unusedThreads].some(colors => colors.length === 0)) {
        throw new Error('No colors left');
    }

    let background = getRandomItem(unusedBackgrounds, disallowedBackground);

    if(background == null){
        return null;
    }

    let fill = getRandomItem<Fill>(unusedFills, background);

    if(fill == null){
        unusedBackgrounds.push(background);
        console.log(`Could not find fill for background`);
        return null;
    }

    let thread = getRandomItem<Thread>(unusedThreads, background);

    if(thread == null){
        unusedBackgrounds.push(background);
        unusedFills.push(fill);
        console.log(`Could not find thread for background`);
        return null;
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

let startTime = Date.now();

let gridCount = 1;
let grid = generateGrid();


while (grid == null) {
    console.log(`Attempt: ${gridCount}`)
    grid = generateGrid();
    gridCount++;
}

const elapsedTime = Date.now() - startTime;
const elapsedPerGrid = elapsedTime / gridCount;

console.log(`${gridCount} grids attempted in ${formatDuration(elapsedTime)} (${elapsedPerGrid.toFixed(2)}ms each)`);

displayGrid(grid);
