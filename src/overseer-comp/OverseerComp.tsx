import './overseer-comp.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../AppState';

export interface OverseerCompProps {
  appState: AppState;
}

export const OverseerComp: React.FC<OverseerCompProps> = observer(({ appState }) => {
  const seqCells: JSX.Element[] = [];

  appState.overseerSequence.forEach((color, idx) => {
    // Set css classes for each cell
    const actionClass = appState.takingOverseerMove === idx ? 'action' : '';
    const classes = ['sequence-grid-cell', actionClass];

    seqCells.push(
      <div
        key={`seq-${idx}`}
        className={classes.join(' ')}
        style={{ backgroundColor: color }}
      ></div>
    );
  });

  return (
    <div className='overseer-comp'>
      <div>Overseer: {appState.overseerTotal}</div>

      <div className='sequence-container'>
        <div>Sequence:</div>
        <div className='sequence-grid'>{seqCells}</div>
      </div>
    </div>
  );
});
