import {
    Thread, 
    Background, 
    Grid, 
    Cell, 
    Fill, 
    Row
} from "./types";
import { 
    unusedBackgrounds, 
    unusedFills, 
    unusedThreads, 
    recycleRow, 
    recycleCell, 
    lookupComboCount, 
    updateComboCount, 
    resetComboCount 
} from "./data";
import { getRandomItem } from "./util";

export function generateGrid(): Grid | null {

    resetComboCount();

    const rows: Row[] = [];

    let previousRow: Row | undefined;

    while (rows.length < 6) {
        const row = generateRow(previousRow);

        if (!row) {
            //console.log(`Recycling Grid null row`);
            rows.forEach(recycleRow);
            return null
        }

        if (row) {
            rows.push(row);
        }

        previousRow = row;
    }

    return rows as Grid;
}

export function generateRow(previousRow?: Row): Row | null {
    const cells: Cell[] = [];

    while (cells.length < 4) {
        const blacklistBackgrounds = cells.map(cell => cell.background);
        if(previousRow){
            blacklistBackgrounds.push(previousRow[cells.length].background);
        }

        const cell = generateCell(blacklistBackgrounds);

        if (cell == null) {
            //console.log(`rejecting row (null cell)`);
            recycleRow(cells);

            return null;
        }

        if (cell) {
            cells.push(cell);
        }
    }

    return cells as Row;
}


export function generateCell(disallowedBackgrounds?: Background[]): Cell | null {

    let background = getRandomItem(unusedBackgrounds, disallowedBackgrounds);

    if(background == null){
        //console.log(`Could not find background (disallowed: ${disallowedBackgrounds})`);
        return null;
    }

    let fill = getRandomItem<Fill>(unusedFills, background);

    if(fill == null){
        unusedBackgrounds.push(background);
        //console.log(`Could not find fill for background '${background}' (available: ${unusedFills})`);
        return null;
    }

    let thread = getRandomItem<Thread>(unusedThreads, [background, fill]);

    if(thread == null){
        unusedBackgrounds.push(background);
        unusedFills.push(fill);
        //console.log(`Could not find thread for background '${background}' (available: ${unusedThreads})`);
        return null;
    }

    const cell: Cell = {
        background,
        fill,
        thread
    };

    if(lookupComboCount(cell) >= 2){
        //console.log(`Reject cell, too many combos`);
        recycleCell(cell);
        return null;
    }

    updateComboCount(cell, lookupComboCount(cell) + 1)

    return cell;
}
