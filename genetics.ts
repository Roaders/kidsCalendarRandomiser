import { generateInitialGrid, mutate } from "./lib/breeding";
import { fitness as scoreFitness } from "./lib/fitness";
import { Grid } from "./lib/types";
import { flatten, highScoreNoLongerChanging, createNullArray } from "./lib/util";
import { displayGrid } from "./lib/display";

console.log(`Creating Initial Population`);

type Population = Grid[];

const populationSize = 100;
const selectionCount = 10;
const mutationMultiplier = 9;
const stableGenerationCount = 50;

function compareGrids(one: Grid, two: Grid) {
    return scoreFitness(two) - scoreFitness(one);
}

function selectPopulation(population: Population) {
    return population.sort(compareGrids)
        .slice(0, selectionCount);
}

function mutatePopulation(population: Population): Grid[] {
    return population.map((grid: Grid) => createNullArray(mutationMultiplier)
        .map(() => mutate(grid))
        .concat([grid])
    )
        .reduce(flatten);
}

let population: Population = Array.from(new Array(populationSize))
    .map(() => generateInitialGrid());

population = selectPopulation(population);

let highestScores: number[] = [];
let generation = 0;

while (!highScoreNoLongerChanging(highestScores, stableGenerationCount)) {
    highestScores.push(scoreFitness(population[0]));
    console.log(`Fittest (generation: ${++generation}): ${population.map(scoreFitness)}`);
    population = mutatePopulation(population);
    population = selectPopulation(population);
}

displayGrid(population[0]);
