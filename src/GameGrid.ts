import { makeObservable, observable } from 'mobx';

export interface GameGridProps {
  width: number;
  height: number;
}

export enum CellColor {
  // RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  // PURPLE = 'purple',
  ORANGE = 'orange',
  WHITE = 'white',
}

export class GameGridCell {
  outOfBounds = false;
  danger = false;
  color = CellColor.WHITE;

  constructor() {
    // 80% chance to be a coloured cell
    if (Math.random() <= 0.9) {
      // Be a random colour
      const colors = Object.values(CellColor).filter((color) => color !== CellColor.WHITE);
      const rnd = Math.floor(Math.random() * colors.length);
      this.color = colors[rnd];
    }

    makeObservable(this, { outOfBounds: observable, danger: observable });
  }
}

export class GridPosition {
  constructor(public x = 0, public y = 0) {
    makeObservable(this, {
      x: observable,
      y: observable,
    });
  }
}

export class GameGrid {
  width: number;
  height: number;
  cells: GameGridCell[][] = [];

  constructor(props: GameGridProps) {
    this.width = props.width;
    this.height = props.height;

    this.createCells();
  }

  createCells() {
    this.cells = [];

    for (let i = 0; i < this.height; i++) {
      const row: GameGridCell[] = [];

      for (let j = 0; j < this.width; j++) {
        row.push(new GameGridCell());
      }

      this.cells.push(row);
    }
  }

  getCellAtPosition(pos: GridPosition) {
    return this.cells[pos.y][pos.x];
  }

  getGridColors() {
    const colors = new Set<CellColor>();

    this.cells.forEach((row) => row.forEach((cell) => colors.add(cell.color)));

    return Array.from(colors);
  }
}
