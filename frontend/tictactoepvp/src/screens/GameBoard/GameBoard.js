import React, { useEffect, useState } from 'react';
import './GameBoard.css';
import '../../components/GameTile/GameTile.tsx';
import GameTile from '../../components/GameTile/GameTile.tsx';
import useWebSocket from 'react-use-websocket'
import WaitForGame from '../../components/WaitForGame/WaitForGame.tsx';

function GameBoard({nick}) {
  //const [isMatchFound, setIsMatchFound] = useState(false)

  const [gameState, setGameState] = useState()
  const [isMyTurn, setIsMyTurn] = useState()
  const [userData, setUserData] = useState()
  const WS_URL='ws://127.0.0.1:8000'

  const {sendJsonMessage, lastJsonMessage} = useWebSocket(WS_URL, {
    queryParams: {nick},
    share: true
  })
  
  const makeAMove = (index) => {
    console.log(`${userData['nick']} moved`)
    sendJsonMessage({option: 'move', index: index})
  }

  useEffect(() => {
    if(lastJsonMessage) {
      console.log(`Last json message: ${JSON.stringify(lastJsonMessage)}`)
      if(lastJsonMessage['kind']==='update') {
        setGameState([...lastJsonMessage['gameState']])
        setUserData(lastJsonMessage['userData'])
      }
    }
    console.log(`gamestate changed ${gameState}`)
    
  }, [lastJsonMessage])
  

    // const gameState = ['', '', '', '', '', '', '', '', ''];
    const [isEnd, setIsEnd] = useState(false);

    function checkWin() {
      //check if specific player wins
      if(gameState[0]=='X' && gameState[4]=='X' && gameState[8]=='X' ||
      gameState[2]=='X' && gameState[4]=='X' && gameState[6]=='X') {
        return true;
      }
      for(let i=0;i<3;i++) {
        if(gameState[i]=='X' && gameState[i+3]=='X' && gameState[i+6]=='X' ||
        gameState[i*3]=='X' && gameState[i*3+1]=='X' && gameState[i*3+2]=='X')
        return true;
      }

      return false;
    }
  return gameState ? (
    <div className='gb-main-div'>
      {!isEnd && (
        <div>
          <div>
            <h1>Player 1 vs Player 2</h1>
          </div>
          {userData['isTheirRound'] ? 
            <div>Your move</div> :
            <div>Opponent's move</div>}
            <div className='gb-game-board'>
                {gameState.map((value, index)=> (
                  <div className='gb-tile-div' onClick={() =>{ 
                    if(gameState[index]==='' && userData['isTheirRound']) {
                      makeAMove(index)
                    } else{
                      console.log(`coś poszło nie tak, index: ${index}, gamestate: ${gameState}, ud: ${userData['isTheirRound']}`)
                    }
                  }
                    
                  //   

                  //   //TODO: send clicked index

                  //   if(gameBoard[index]=='') {

                  //     //TODO: recognize player 1 or player 2 marks
                  //     gameBoard[index]='X';
                  //   }
                  //   if(checkWin()) {
                  //     setIsEnd(true);
                  //   }
                  }>
                    <GameTile value={gameState[index]} />
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
  ) : ( <WaitForGame nick={nick} />)
}

export default GameBoard;