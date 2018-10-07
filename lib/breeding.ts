import {
    Grid, 
    Cell, 
    Row
} from "./types";

import { removeRandomItem, getRandomItem } from "./util";
import { generateMaterials, Materials } from "./materials";

export function mutate(grid: Grid){
    grid = cloneGrid(grid);

    const rowOne = getRandomItem(grid);
    const rowTwo = getRandomItem(grid);
    const cellOne = getRandomItem(rowOne);
    const cellTwo = getRandomItem(rowTwo);

    const cloneOne: Cell = cloneCell(cellOne);
    const cloneTwo: Cell = cloneCell(cellTwo);

    cellOne.background = cloneTwo.background;
    cellTwo.background = cloneOne.background;

    return grid;
}

export function generateInitialGrid(): Grid {

    const materials = generateMaterials();

    const rows: Row[] = [];

    while (rows.length < 6) {
        rows.push(generateRow(materials));
    }

    return rows as Grid;
}

function generateRow(materials: Materials): Row {
    const cells: Cell[] = [];

    while (cells.length < 4) {
        cells.push(generateCell(materials));
    }

    return cells as Row;
}

function generateCell(materials: Materials): Cell {

    const cell: Cell = {
        background: removeRandomItem(materials.backgrounds),
        fill: removeRandomItem(materials.fills),
        thread: removeRandomItem(materials.threads)
    };

    return cell;
}

function cloneGrid(grid: Grid): Grid{
    return grid.map(cloneRow) as Grid;
}

function cloneRow(row: Row): Row{
    return row.map(cloneCell) as Row;
}

function cloneCell(cell: Cell): Cell{
    return {...cell}
}
