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