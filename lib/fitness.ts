import { Grid, Row, Column, Cell, getGridColumns } from "./types";
import { allBackgrounds } from "./materials";
import { stringifyGrid, count } from "./util";

var fitnessCache: { [key: string]: number } = {};

export function fitness(grid: Grid) {
    const gridString = stringifyGrid(grid);
    let fitness = fitnessCache[gridString];

    if (fitness == null) {
        fitness = calculateFitness(grid);

        fitnessCache[gridString] = fitness;
    }

    return fitness;
}

function calculateFitness(grid: Grid){
    const rowScore = grid.map(rowFitness)
        .reduce(sumScore, 0);

    const columnScore = getGridColumns(grid)
        .map(columnFitness)
        .reduce(sumScore, 0);

    return rowScore + columnScore;
}

function columnFitness(column: Column) {
    return [scoreAdjacentBackgroundsInColumn]
        .map(func => func(column))
        .reduce(sumScore, 0);
}

function rowFitness(row: Row) {
    return [
        scoreDuplicateColorsOnRow,
        scoreCellsInRow
    ]
        .map(func => func(row))
        .reduce(sumScore, 0);
}

function scoreCellsInRow(row: Row) {
    return row.map(scoreCell)
        .reduce(sumScore, 0);
}

function scoreCell(cell: Cell) {
    return [scoreCellBackgroundMatchesFill]
        .map(func => func(cell))
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

function scoreAdjacentBackgroundsInColumn(column: Column){
    return column.map((cell, index, cells) => {
        const previousCell = cells[index-1];

        return previousCell && previousCell.background === cell.background ? -1000 : 0;
    })
    .reduce(sumScore, 0);
}

function sumScore(score: number, currentScore: number): number {
    return score + currentScore;
}
