import "colors";

import { Grid } from "./lib/types";
import { displayGrid } from "./lib/display";

import formatDuration from "format-duration";
import { generateGrid } from "./lib/generators";

import {clearLine, cursorTo} from "readline";

let startTime = Date.now();

let gridCount = 0;

console.log(`Generating grids`);

let grid: Grid | null = null;

while (grid == null) {
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    process.stdout.write(`Attempt: ${++gridCount}`)
    grid = generateGrid();
}
process.stdout.write("\n");

const elapsedTime = Date.now() - startTime;
const elapsedPerGrid = elapsedTime / gridCount;

console.log(`${gridCount} grids attempted in ${formatDuration(elapsedTime)} (${elapsedPerGrid.toFixed(2)}ms each)`);

displayGrid(grid);
