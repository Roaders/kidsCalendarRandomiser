import { Grid, Cell, Row, Background, Thread, Fill } from "./types";


export function displayGrid(grid: Grid){
    const maxLength = grid.reduce<Cell[]>((cells, row) => { cells.push(...row); return cells; }, [])
        .map(displayCell)
        .reduce((length, display) => display.length > length ? display.length : length, 0);

    grid.forEach(r => console.log(displayRow(r, maxLength)));

}

function displayRow(row: Row, maxLength: number) {
    return row.map(cell => displayCell(cell, maxLength)).join(" | ");
}

function displayCell(cell: Cell, maxLength: number) {
    let displayString = displayBackground(cell.background, `F:${displayField(cell.fill)},T:${displayField(cell.thread)}`);

    while (displayString.length < maxLength) {
        displayString = `${displayString} `;
    }

    return displayString;
}

function displayBackground(field: Background, content: String): string {
    switch (field) {
        case "Red":
            return `${displayField(field)} ${content.bgRed}`;

        case "Blue":
            return `${displayField(field)} ${content.bgBlue}`;

        case "Green":
            return `${displayField(field)} ${content.bgGreen}`;

        case "Pink":
            return `${displayField(field)} ${content.bgMagenta}`;

        case "Purple":
            return `${displayField(field)} ${content.bgCyan}`;

        case "Yellow":
            return `${displayField(field)} ${content.bgYellow}`;

        default:
            return displayNever(field)
    }
}

function displayField(field: Background | Thread | Fill): string {
    switch (field) {
        case "Red":
            return String(field).red;

        case "Blue":
            return String(field).blue;

        case "Green":
            return String(field).green;

        case "Pink":
            return String(field).magenta;

        case "Purple":
            return String(field).cyan;

        case "Yellow":
            return String(field).yellow;

        default:
            return displayNever(field)
    }
}

function displayNever(never: never): string {
    return String(never);
}