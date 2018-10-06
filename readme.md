
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


| No Optimisation |
| --- |
| 20847 in 4s (0.23ms) |
| 18973 in 3s (0.23ms) |
| 55621 in 12s (0.22ms) |
| 3086 in <1s (0.24ms) |
| 983 in < 1s (0.25ms) |