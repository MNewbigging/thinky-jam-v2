import './player-comp.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from '../AppState';

export interface PlayerCompProps {
  appState: AppState;
}

export const PlayerComp: React.FC<PlayerCompProps> = observer(({ appState }) => {
  const topPos = 4 + appState.playerPosition.y * 40;
  const leftPos = 10 + appState.playerPosition.x * 40;

  return (
    <div className='player-comp' style={{ top: `${topPos}px`, left: `${leftPos}px` }}>
      P
    </div>
  );
});
