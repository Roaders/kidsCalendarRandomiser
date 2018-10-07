export type Background = "Red" | "Green" | "Blue" | "Purple" | "Yellow" | "Pink";
export type Fill = "Yellow" | "Pink" | "Red" | "Green";
export type Thread = "Yellow" | "Green" | "Red" | "Blue";

export type Cell = {
    background: Background;
    fill: Fill;
    thread: Thread;
};

export type Row = [Cell, Cell, Cell, Cell];
export type Grid = [Row, Row, Row, Row, Row, Row];
export type Column = [Cell, Cell, Cell, Cell, Cell, Cell];

export function getGridColumns(grid: Grid): Column[]{
    return [0,1,2,3]
        .map(columnIndex => generateColumn(columnIndex, grid));
}

function generateColumn(index: number, grid: Grid): Column{
    return grid.map(row => row[index]) as Column;
}
