import { generateInitialGrid, mutate } from "./lib/breeding";
import { fitness as scoreFitness } from "./lib/fitness";
import { Grid } from "./lib/types";
import { flatten, stringifyGrid } from "./lib/util";

console.log(`Creating Initial Population`);

type Population = Grid[];

const populationSize = 100;
const selectionCount = 10;
const mutationMultiplier = 9;

function compareGrids(one: Grid, two: Grid){
    return scoreFitness(two) - scoreFitness(one);
}

function selectPopulation(population: Population){
    return population.sort(compareGrids)
        .slice(0,selectionCount);
}

function mutatePopulation(population: Population){
    return population.map(grid => Array.from(Array(mutationMultiplier))
        .map(() => mutate(grid))
    )
    .reduce(flatten);
}

let population: Population = Array.from(new Array(populationSize))
    .map(() => generateInitialGrid());

for(let i = 0; i < 10; i++){
    population = selectPopulation(population);
    console.log(`Fittest(${i}): ${population.map(scoreFitness)}`);
    population = mutatePopulation(population)
}
