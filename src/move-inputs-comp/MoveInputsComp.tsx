import './move-inputs-comp.scss';

import React from 'react';

import { AppState, PlayerMove } from '../AppState';

export interface MoveInputsCompProps {
  appState: AppState;
}

export const MoveInputsComp: React.FC<MoveInputsCompProps> = ({ appState }) => {
  return (
    <div className='move-inputs-comp'>
      <div className='move-inputs-cell'></div>
      <div className='move-inputs-cell border' onClick={() => appState.selectMove(PlayerMove.UP)}>
        ⇧
      </div>
      <div className='move-inputs-cell'></div>

      <div className='move-inputs-cell border' onClick={() => appState.selectMove(PlayerMove.LEFT)}>
        ⇦
      </div>
      <div className='move-inputs-cell border' onClick={() => appState.selectMove(PlayerMove.NONE)}>
        🚫
      </div>
      <div
        className='move-inputs-cell border'
        onClick={() => appState.selectMove(PlayerMove.RIGHT)}
      >
        ⇨
      </div>

      <div className='move-inputs-cell'></div>
      <div className='move-inputs-cell border' onClick={() => appState.selectMove(PlayerMove.DOWN)}>
        ⇩
      </div>
      <div className='move-inputs-cell'></div>
    </div>
  );
};
