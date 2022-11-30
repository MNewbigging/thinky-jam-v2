import './app.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

import { AppState } from './AppState';
import { GameGridComp } from './game-grid-comp/GameGridComp';
import { MoveInputsComp } from './move-inputs-comp/MoveInputsComp';
import { MovesComp } from './moves-comp/MovesComp';
import { OverseerComp } from './overseer-comp/OverseerComp';
import { PlayerComp } from './player-comp/PlayerComp';

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  return (
    <div className='app'>
      {appState.gameEnded && <div className='game-over-msg'>GAME OVER!</div>}
      <div className='help-msg'>Grey squares provide cover from overseer!</div>

      <OverseerComp appState={appState} />
      <MovesComp appState={appState} />

      <div className='inputs-row'>
        <button className='button' onClick={() => appState.newGame()}>
          New Game
        </button>
        <MoveInputsComp appState={appState} />
        <button disabled={!appState.canTakeAction} onClick={() => appState.readyToMove()}>
          Ready to move
        </button>
      </div>

      <div className='grid-container'>
        {appState.grid && <GameGridComp appState={appState} />}
        {appState.grid && <PlayerComp appState={appState} />}
      </div>
    </div>
  );
});
