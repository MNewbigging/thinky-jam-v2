import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { GameGrid, GridPosition } from './GameGrid';
import { KeyboardListener } from './KeyboardListener';

export enum PlayerMove {
  UP = '⇧',
  RIGHT = '⇨',
  DOWN = '⇩',
  LEFT = '⇦',
  NONE = '🚫',
  EMPTY = '',
}

export enum GamePhase {
  PLAN = 'plan',
  ACTION = 'action',
}

export class AppState {
  grid: GameGrid | undefined = undefined;
  playerPosition = new GridPosition(0, 1);
  overseerSequence: number[] = [];
  playerMoves: PlayerMove[] = [];
  focusedMoveCell: number | undefined = undefined;
  gamePhase: GamePhase | undefined = undefined;
  takingPlayerMove: number | undefined = undefined;
  takingOverseerMove: number | undefined = undefined;
  overseerTotal = 0;
  overseerTurning = false;
  gameEnded = false;

  private keyboardListener = new KeyboardListener();
  private readonly turnThreshold = 5;
  private readonly knockbackSpaces = 2;
  private dangerColumn = -1;

  constructor() {
    makeObservable(this, {
      grid: observable,
      playerPosition: observable,
      overseerSequence: observable,
      generateOverseerSequence: action,
      playerMoves: observable,
      planPhase: action,
      focusMoveCell: action,
      focusedMoveCell: observable,
      selectMove: action,
      gamePhase: observable,
      canTakeAction: computed,
      actionPhase: action,
      takingPlayerMove: observable,
      takingOverseerMove: observable,
      takePlayerMove: action,
      takeOverseerMove: action,
      overseerTotal: observable,
      overseerTurning: observable,
      newGame: action,
      onEscape: action,
      nextDangerColumn: action,
      gameEnded: observable,
      gameOver: action,
    });

    this.keyboardListener.on('escape', this.onEscape);
  }

  get canTakeAction() {
    if (!this.playerMoves.length) {
      return false;
    }

    return this.playerMoves.every((move) => move !== PlayerMove.EMPTY);
  }

  newGame() {
    this.grid = new GameGrid({ width: 12, height: 3 });
    this.playerPosition = new GridPosition(0, 1);
    this.takingPlayerMove = undefined;
    this.takingOverseerMove = undefined;
    this.overseerTotal = 0;
    this.overseerTurning = false;
    this.gameEnded = false;
    this.dangerColumn = -1;

    this.planPhase();
  }

  planPhase() {
    // Get a new overseer number sequence
    this.generateOverseerSequence();

    // Clear player moves
    this.resetPlayerMoves();
  }

  generateOverseerSequence() {
    this.overseerSequence = [];

    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 5);
      this.overseerSequence.push(num);
    }
  }

  resetPlayerMoves() {
    this.playerMoves = [
      PlayerMove.EMPTY,
      PlayerMove.EMPTY,
      PlayerMove.EMPTY,
      PlayerMove.EMPTY,
      PlayerMove.EMPTY,
    ];
  }

  focusMoveCell(cellIndex: number) {
    this.focusedMoveCell = cellIndex;
  }

  onEscape = () => {
    this.focusedMoveCell = undefined;
  };

  selectMove(move: PlayerMove) {
    if (this.focusedMoveCell === undefined) {
      // Focus on first empty cell
      const idx = this.playerMoves.findIndex((move) => move === PlayerMove.EMPTY);
      if (idx < 0) {
        return;
      }

      this.focusMoveCell(idx);
    }

    this.playerMoves[this.focusedMoveCell] = move;

    // Auto select next move cell
    if (this.focusedMoveCell + 1 < this.playerMoves.length) {
      this.focusedMoveCell++;
    }
  }

  readyToMove() {
    this.onEscape();

    this.actionPhase(0);
  }

  async actionPhase(moveIndex: number) {
    // First, player takes their first move
    this.takePlayerMove(moveIndex);

    // Let the animation play out
    await this.sleep(500);

    // No longer taking player move
    runInAction(() => (this.takingPlayerMove = undefined));

    // Then the overseer does his thing
    this.takeOverseerMove(moveIndex);

    // Game might have ended above
    if (this.gameEnded) {
      return;
    }

    // Let the animation play out
    await this.sleep(500);

    // No longer taking overseer move
    runInAction(() => {
      this.takingOverseerMove = undefined;
      this.overseerTurning = false;
    });

    // Call this again if there are more moves to take
    if (moveIndex < 4) {
      this.actionPhase(moveIndex + 1);
    } else {
      // This action phase is now done - another column of cells are now dangerous
      this.nextDangerColumn();

      // Did this cover the player?
      if (this.isPlayerOnDangerCell()) {
        this.gameOver();
        return;
      }

      // Move back to planning phase
      this.planPhase();
    }
  }

  takePlayerMove(moveIndex: number) {
    this.takingPlayerMove = moveIndex;

    const move = this.playerMoves[moveIndex];
    switch (move) {
      case PlayerMove.UP:
        // Make sure there is a cell above to move to
        if (this.playerPosition.y > 0) {
          this.playerPosition.y--;
        }
        break;
      case PlayerMove.RIGHT:
        if (this.playerPosition.x < this.grid.width) {
          this.playerPosition.x++;
        }
        break;
      case PlayerMove.DOWN:
        if (this.playerPosition.y < this.grid.height) {
          this.playerPosition.y++;
        }
        break;
      case PlayerMove.LEFT:
        if (this.playerPosition.x > 0) {
          this.playerPosition.x--;
        }
        break;
      case PlayerMove.NONE:
        // Player stays still
        break;
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  takeOverseerMove(moveIndex: number) {
    this.takingOverseerMove = moveIndex;

    // Add the next sequence number to overseer's total
    const nextAmount = this.overseerSequence[moveIndex];
    this.overseerTotal += nextAmount;

    // Is it over the turn-threshold?
    if (this.overseerTotal >= this.turnThreshold) {
      // Turn
      this.overseerTurning = true;
      this.overseerTotal = 0;

      // Did the overseer see the player?
      const playerCell = this.grid.getCellAtPosition(this.playerPosition);
      if (!playerCell.cover) {
        // Player was seen! Move back two spaces
        this.playerPosition.x -= this.knockbackSpaces;

        // Ensure this doesn't knock player off grid
        if (this.playerPosition.x < 0) {
          this.playerPosition.x = 0;
        }

        // Did this knock the player back into a danger cell?
        if (this.isPlayerOnDangerCell()) {
          this.gameOver();
        }
      }
    }
  }

  nextDangerColumn() {
    this.dangerColumn++;

    for (let i = 0; i < 3; i++) {
      this.grid.cells[i][this.dangerColumn].danger = true;
    }
  }

  isPlayerOnDangerCell() {
    const playerCell = this.grid.getCellAtPosition(this.playerPosition);
    if (playerCell.danger) {
      return true;
    }
  }

  gameOver() {
    console.error('GAME OVER!!');

    // Stop the action phase
    this.gameEnded = true;
  }
}
