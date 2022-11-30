import { makeObservable, observable } from 'mobx';

export interface GameGridProps {
  width: number;
  height: number;
}

export class GameGridCell {
  cover = false;
  danger = false;

  constructor() {
    this.cover = Math.random() < 0.5;

    makeObservable(this, { danger: observable });
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
}
