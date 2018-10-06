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
        const blacklistBackgrounds = cells.map(cell => cell.background);
        if(previousRow){
            blacklistBackgrounds.push(previousRow[cells.length].background);
        }

        const cell = generateCell(blacklistBackgrounds);

        if (cell == null) {
            console.log(`rejecting row (null cell)`);
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

function generateCell(disallowedBackgrounds?: Background[]): Cell | null {

    let background = getRandomItem(unusedBackgrounds, disallowedBackgrounds);

    if(background == null){
        console.log(`Could not find background (disallowed: ${disallowedBackgrounds})`);
        return null;
    }

    let fill = getRandomItem<Fill>(unusedFills, background);

    if(fill == null){
        unusedBackgrounds.push(background);
        console.log(`Could not find fill for background '${background}' (available: ${unusedFills})`);
        return null;
    }

    let thread = getRandomItem<Thread>(unusedThreads, background);

    if(thread == null){
        unusedBackgrounds.push(background);
        unusedFills.push(fill);
        console.log(`Could not find thread for background '${background}' (available: ${unusedThreads})`);
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
