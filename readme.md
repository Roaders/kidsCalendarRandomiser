
# Calendar Randomiser

A util to help my wife design a christmas calendar with random colored pockets. Each pocket has a background color, a fill color (for the number) and a stitch color.

There are some rules for the randomness. In this brute force implementation if any rules are broken the grid is generated from scratch. This means that there will probably tens of thousands of attempts to generate the grid. On my machine this takes only takes around 10 seconds and I'll probbaly never run it again so I'm not going to try and optimise!

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

## Optimisation

OK, I said I wasn't going to optimise but I like playing with code so lets see how much we can improve this with some minor tweaks to the algorithm...


| No Optimisation | Disallowed Backgrounds | Random Selection |
| --- | --- | --- | --- |
| 20847 in 4s (0.23ms) | 46300 in 9s (22ms) | 191 in <1s (20ms) |
| 18973 in 3s (0.23ms) | 14656 in 31s (21ms) | 1455 in <1s (18ms) |
| 55621 in 12s (0.22ms) | 189143 in 39s (21ms) | 2082 in <1s (18ms) |
| 3086 in <1s (0.24ms) | 109610 in 23s (21ms) | 460 in <1s (18ms) |
| 983 in < 1s (0.25ms) | 280398 in 59s (21ms) | 184 in <1s (18ms) |

### Disallowed Backgrounds
Passed the background color from the cell above the current cell being generated so that clashing colors are not selected.

Somehow this seemed to make things worse and result in more attempts being made. I don't understand this.

### Random Selection
Supported a disallowed parameter on the `getRandomItem` function to make random selections quicker. For example when picking a `Fill` we pass in the background color. When picking a `Background` we pass in the `Background` of the `Cell` above.

This had a huge effect. Again I can't quite understand how this resulted in so many fewer grid attempts. I expected this to improve the performance of `generateCell` but not actually change it's output.