import {
    Grid, 
    Cell, 
    Row
} from "./types";

import { removeRandomItem, getRandomItem } from "./util";
import { generateMaterials, Materials } from "./materials";

const cellProperties: (keyof Cell)[] = ["background", "fill", "thread"];

export function mutate(grid: Grid): Grid{
    grid = cloneGrid(grid);

    cellProperties.forEach(prop => mutateRandomCellProperty(grid, prop));

    return grid;
}

function mutateRandomCellProperty(grid: Grid, prop: keyof Cell){
    const cellOne = getRandomCell(grid);
    const cellTwo = getRandomCell(grid);

    const valueOne = cellOne[prop];
    const valueTwo = cellTwo[prop];

    cellOne[prop] = valueTwo;
    cellTwo[prop] = valueOne;
}

function getRandomCell(grid: Grid): Cell{
    const row = getRandomItem(grid);
    return getRandomItem(row);
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
