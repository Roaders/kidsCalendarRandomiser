
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

!(./assets/sample.jpg)
