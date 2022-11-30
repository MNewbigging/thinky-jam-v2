import './moves-comp.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../AppState';

export interface MovesCompProps {
  appState: AppState;
}

export const MovesComp: React.FC<MovesCompProps> = observer(({ appState }) => {
  const moveCells: JSX.Element[] = [];

  appState.playerMoves.forEach((move, idx) => {
    // Set css classes for this move cell
    const focusedClass = appState.focusedMoveCell === idx ? 'focus' : '';
    const takingMove = appState.takingPlayerMove === idx ? 'action' : '';
    const classes = ['moves-grid-cell', focusedClass, takingMove];

    moveCells.push(
      <div
        key={`move-cell-${idx}`}
        className={classes.join(' ')}
        onClick={() => appState.focusMoveCell(idx)}
      >
        {move}
      </div>
    );
  });

  return (
    <div className='moves-comp'>
      <div>Moves:</div>
      <div className='moves-grid'>{moveCells}</div>
    </div>
  );
});
