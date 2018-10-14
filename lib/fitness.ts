import { Grid, Row, Column, Cell, getGridColumns } from "./types";
import { allBackgrounds } from "./materials";
import { stringifyGrid, count, stringifyCell, sumScore, isDefined } from "./util";

var fitnessCache: { [key: string]: number } = {};

type ColorComboCount = {
    cell: Cell,
    count: number
};

export function fitness(grid: Grid) {
    const gridString = stringifyGrid(grid);
    let fitness = fitnessCache[gridString];

    if (fitness == null) {
        fitness = calculateGridFitness(grid);

        fitnessCache[gridString] = fitness;
    }

    return fitness;
}

function calculateGridFitness(grid: Grid) {

    return [
        rowsFitness,
        columnsFitness,
        scoreCellComboReuse
    ]
        .map(func => func(grid))
        .reduce(sumScore, 0);
}

function scoreCellComboReuse(grid: Grid) {

    const comboLookup: { [key: string]: ColorComboCount } = {};
    const comboList: ColorComboCount[] = [];

    function addCell(cell: Cell) {
        const cellString = stringifyCell(cell);

        let comboCount: ColorComboCount = comboLookup[cellString];

        if (comboCount == null) {
            comboCount = {
                cell,
                count: 0
            }
            comboLookup[cellString] = comboCount;
            comboList.push(comboCount);
        }

        comboCount.count++;
    }

    grid.forEach(row => row.forEach(addCell));

    return -comboList.filter(combo => combo.count > 1)
        .map(combo => combo.count)
        .reduce(sumScore, 0)

}

function rowsFitness(grid: Grid) {
    return grid.map(rowFitness)
        .reduce(sumScore, 0);
}

function columnsFitness(grid: Grid) {
    return getGridColumns(grid)
        .map(columnFitness)
        .reduce(sumScore, 0);
}

function columnFitness(column: Column) {
    return [
        scoreAdjacentBackgroundsInColumn,
        scoreSequentialColorsDifferent,
        scoreUniqueBackgrounds
    ]
        .map(func => func(column))
        .reduce(sumScore, 0);
}

function scoreUniqueBackgrounds(cells: Cell[]){
    return cells.map(cell => count(cells, countCell => countCell.background === cell.background))
        .filter(count => count === 1)
        .reduce(sumScore, 0);
}

function rowFitness(row: Row) {
    return [
        scoreDuplicateColorsOnRow,
        scoreCellsInRow,
        scoreSequentialColorsDifferent
    ]
        .map(func => func(row))
        .reduce(sumScore, 0);
}

function scoreSequentialColorsDifferent(cells: Cell[]) {
    return cells.reduce(scoreAdjacentCellsHaveDifferentColors, 0);
}


function scoreAdjacentCellsHaveDifferentColors(
    currentScore: number,
    cell: Cell,
    index: number,
    cells: Cell[]) {

    const previousCell = index > 0 ? cells[index - 1] : null;

    if (!previousCell) {
        return currentScore
    }

    return [
        cell.thread != previousCell.thread, 
        cell.fill != previousCell.fill
    ]
        .map(value => value ? 6 : 0)
        .reduce(sumScore, 0);
}

function scoreCellsInRow(row: Row) {
    return row.map(scoreCell)
        .reduce(sumScore, 0);
}

function scoreCell(cell: Cell) {
    return [
        scoreCellBackgroundMatchesFill,
        scoreThreadColorDoesNotMatch
    ]
        .map(func => func(cell))
        .reduce(sumScore, 0);
}

function scoreThreadColorDoesNotMatch(cell: Cell): number {
    return [cell.thread != cell.background, cell.thread != cell.fill]
        .map(value => value ? 1 : 0)
        .reduce(sumScore, 0);
}

function scoreCellBackgroundMatchesFill(cell: Cell): number {
    return cell.background === cell.fill ? -1000 : 0;
}

function scoreDuplicateColorsOnRow(row: Row) {
    return allBackgrounds.map(background => count(row, row => row.background === background))
        .filter(count => count > 1)
        .map(count => count * -1000)
        .reduce(sumScore, 0);
}

function scoreAdjacentBackgroundsInColumn(column: Column) {
    return column.map((cell, index, cells) => {
        const previousCell = cells[index - 1];

        return previousCell && previousCell.background === cell.background ? -1000 : 0;
    })
        .reduce(sumScore, 0);
}
