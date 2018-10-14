
# Pattern Randomiser

This was a little util to help my wife with a craft project. It was a christmas present for a child of a friend of ours. The project had a 4 * 6 grid, each cell in the grid had a different background color fill color and thread color. The grid should be generated randomly - and look "random".

## Rules

When generating the grid the following rules MUST be adhered to:

* There are 6 background colors and each one is to be used 4 times
* There are 4 fill colors and each is to be used 6 times
* There are 4 thread colors and each is to be used 6 times
* The background color and fill color must be different
* Each background color can only be used once in a row
* The background color of adjacent vertical cells must be different

### Nice to Have

* Reuse each background / fill / thread combination as few times as possible
* The thread color should not match the background color or the fill color
* Thread and fill colors should be differnet on consequtive cells going in either a vertical or horizontal direction

## Installation

```
git clone https://github.com/Roaders/kidsCalendarRandomiser.git
npm install
```

## Build

```
npm run build
```

## Running

```
npm start
```

## Output

![Shcreenshot of output](/assets/sample.jpg)

## Brute Force

There are some rules for the randomness. In my initial brute force implementation if any rules are broken the grid is generated from scratch. This means that there will probably be tens of thousands of attempts to generate the grid. On my machine this takes only takes around 10 seconds and I'll probbaly never run it again so I'm not going to try and optimise (I said at the time)!

### Optimisation

OK, I said I wasn't going to optimise but I like playing with code so lets see how much we can improve this with some minor tweaks to the algorithm...

| No Optimisation | Column Backgrounds | Random Selection | Row Backgrounds |
| --- | --- | --- | --- |
| 20847 in 4s (0.23ms) | 46300 in 9s (22ms) | 191 in <1s (20ms) | 3 in <1s (33ms) |
| 18973 in 3s (0.23ms) | 14656 in 31s (21ms) | 1455 in <1s (18ms) | 11 in <1s (27ms) |
| 55621 in 12s (0.22ms) | 189143 in 39s (21ms) | 2082 in <1s (18ms) | 1 in <1s (1ms) |
| 3086 in <1s (0.24ms) | 109610 in 23s (21ms) | 460 in <1s (18ms) | 9 in <1s (33ms) |
| 983 in < 1s (0.25ms) | 280398 in 59s (21ms) | 184 in <1s (18ms) | 9 in <1s (33ms) |

#### Column Backgrounds
Passed the background color from the cell above the current cell being generated so that clashing colors are not selected.

Somehow this seemed to make things worse and result in more attempts being made. I don't understand this.

#### Random Selection
Supported a disallowed parameter on the `getRandomItem` function to make random selections quicker. For example when picking a `Fill` we pass in the background color. When picking a `Background` we pass in the `Background` of the `Cell` above.

This had a huge effect. Again I can't quite understand how this resulted in so many fewer grid attempts. I expected this to improve the performance of `generateCell` but not actually change it's output.

#### Row Backgrounds
Also pass the backgrounds for the existing cells in the row to the random selection function.

This had a huge effect taking the number of attempts down to less that 10 in most cases.

## Genetic Algorithm

### Running 

```
npm run breed
```

Using a genetic algorithm had a few advantages ofver the more traditional approach that I initially implemented. The steps fer genererating a grid using a genetic algorithm are:

* Randomly generate 100 grids to form an initial population
* Generate a fitness score for each grid
* Select the 10 grids with the highest fitness score
* Mutate these 10 grids with very small random changes to create a new population of 100
* Select the 10 fittest
* Repeat these steps until the fitness of the population stays the same for 50 generations

This is called a genetic algorithm as it uses the same principals as evolution - survival of the fittest. Typically in a genetic algorithm you would combine aspects from different members of the selected population to try and create a better offspring but that wasn't really possible in this case.

The most important part of this process is the fitness function. This takes a grid and generates a score. This is where we define what we consider to be a good grid.

In this case I gave large negative scores to any grid that broke any of the rules - for example if the same fill and background colors were used. This very quickly resulted in a population of legal grids.

The next stage was to select for grids that performed best against the "nice to have" list. This process works really well as it is actually impossible to create a grid that obeys all the "nice to have" list. Our fitness function however selects the grids that get closest to obeying them all. It also allows us to prioritise one of the rules over the other by associating a higher score with that rule.