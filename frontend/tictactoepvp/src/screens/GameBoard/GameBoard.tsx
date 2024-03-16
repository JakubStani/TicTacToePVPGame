import React, { useState } from 'react';
import './GameBoard.css';
import '../../components/GameTile/GameTile.tsx';
import GameTile from '../../components/GameTile/GameTile.tsx';

function GameBoard() {

    const gameBoard = ['', '', '', '', '', '', '', '', ''];
    const [isEnd, setIsEnd] = useState(false);

    function checkWin(): boolean {
      //check if specific player wins
      if(gameBoard[0]=='X' && gameBoard[4]=='X' && gameBoard[8]=='X' ||
      gameBoard[2]=='X' && gameBoard[4]=='X' && gameBoard[6]=='X') {
        return true;
      }
      for(let i=0;i<3;i++) {
        if(gameBoard[i]=='X' && gameBoard[i+3]=='X' && gameBoard[i+6]=='X' ||
        gameBoard[i*3]=='X' && gameBoard[i*3+1]=='X' && gameBoard[i*3+2]=='X')
        return true;
      }

      return false;
    }
  return (
    <div className='gb-main-div'>
      {!isEnd && (
        <div>
          <div>
            <h1>Player 1 vs Player 2</h1>
          </div>
            <div className='gb-game-board'>
                {gameBoard.map((value, index)=> (
                  <div className='gb-tile-div' onClick={() => {
                    if(gameBoard[index]=='') {

                      //TODO: recognize player 1 or player 2 marks
                      gameBoard[index]='X';
                    }
                    if(checkWin()) {
                      setIsEnd(true);
                    }
                  }}>
                    <GameTile />
                  </div>  
                ))}
            </div>
          </div>
          )
        }
        {isEnd && (
          //TODO: recognize which player has won
          <div>
            <h1>Player 1 has won!</h1>
          </div>
        )}
    </div>
  )
}

export default GameBoard;