import React from 'react'
import './GameBoard.css'
import '../../components/GameTile/GameTile.tsx'
import GameTile from '../../components/GameTile/GameTile.tsx';

function GameBoard() {

    const gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className='gb-main-div'>
        <div className='gb-game-board'>
            {gameBoard.map(()=> (
                <GameTile />
            ))}
        </div>
    </div>
  )
}

export default GameBoard