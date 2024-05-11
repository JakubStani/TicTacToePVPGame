import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import "../../components/GameTile/GameTile.tsx";
import GameTile from "../../components/GameTile/GameTile.tsx";
import useWebSocket from "react-use-websocket";
import WaitForGame from "../../components/WaitForGame/WaitForGame.tsx";

function GameBoard({
  nick,
  WS_URL,
  lastJsonMessage,
  sendJsonMessage,
  isAuthenticated,
}) {
  //const [isMatchFound, setIsMatchFound] = useState(false)

  const [gameState, setGameState] = useState();
  const [isMyTurn, setIsMyTurn] = useState();
  const [userData, setUserData] = useState();
  const [opponentData, setOpponentData] = useState();
  const [isEnd, setIsEnd] = useState();
  const [winner, setWinner] = useState();
  const [mark, setMark] = useState();
  const [gameResult, setGameResult] = useState();
  const [shouldLoadGame, setShouldLoadGame] = useState(false);

  const [pubId, setPubId] = useState();

  // const getPubId=()=> {
  //   axios.get('http://169.254.169.254/latest/meta-data/public-ipv4')
  //     .then(response => {
  //       setPubId(response.data)
  //       console.log(`Public IP: ${response.data}`)
  //       return response.data
  //     })
  //     .catch(error => {
  //       console.log(`error while catching IP data: ${error}`)
  //     })
  // }

  // const WS_URL=`ws://${getPubId()}:8000`
  console.log(`wsUrl ${WS_URL}`);

  // const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
  //   queryParams: { nick },
  //   share: true,
  // });

  const makeAMove = (index) => {
    console.log(`${userData["nick"]} moved`);
    sendJsonMessage({ option: "move", index: index });
  };

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Last json message: ${JSON.stringify(lastJsonMessage)}`);
      // if(lastJsonMessage['kind']==='update') {
      //   setGameState([...lastJsonMessage['gameState']])
      //   setUserData(lastJsonMessage['userData'])
      // }

      if (lastJsonMessage["kind"] === "endedGame") {
        setWinner(lastJsonMessage["winner"]);
        setIsEnd(true);
        setGameResult(lastJsonMessage["gameResult"]);
      }
      if (lastJsonMessage["kind"] === "accessTokenRequest") {
        sendJsonMessage({
          accessToken: localStorage.getItem("accessToken-tttpvp"),
        });
      }
      if (
        lastJsonMessage["kind"] != "endedGame" &&
        lastJsonMessage["kind"] != "accessTokenRequest" &&
        lastJsonMessage["kind"] != "signUpAnswer" &&
        lastJsonMessage["kind"] != "signInAnswer" &&
        lastJsonMessage["kind"] != "refreshTokenAnswer"
      ) {
        setMark(lastJsonMessage["mark"]);
        setGameState([...lastJsonMessage["gameState"]]);
        setUserData(lastJsonMessage["userData"]);
        setOpponentData(lastJsonMessage["opponentData"]);

        // switch(lastJsonMessage['kind']) {
        //   case 'update':
        //     setGameState([...lastJsonMessage['gameState']])
        //     setUserData(lastJsonMessage['userData'])
        //     setOpponentData(lastJsonMessage['opponentData'])
        //     break
        //   case 'endedGame':
        //     setGameState([...lastJsonMessage['gameState']])
        //     setUserData(lastJsonMessage['userData'])
        //     setOpponentData(lastJsonMessage['opponentData'])
        //     setWinner(lastJsonMessage['winner'])
        // }
      }
    }
    console.log(`gamestate changed ${gameState}`);
  }, [lastJsonMessage]);

  // const gameState = ['', '', '', '', '', '', '', '', ''];

  function checkWin() {
    //check if specific player wins
    if (
      (gameState[0] == "X" && gameState[4] == "X" && gameState[8] == "X") ||
      (gameState[2] == "X" && gameState[4] == "X" && gameState[6] == "X")
    ) {
      return true;
    }
    for (let i = 0; i < 3; i++) {
      if (
        (gameState[i] == "X" &&
          gameState[i + 3] == "X" &&
          gameState[i + 6] == "X") ||
        (gameState[i * 3] == "X" &&
          gameState[i * 3 + 1] == "X" &&
          gameState[i * 3 + 2] == "X")
      )
        return true;
    }

    return false;
  }
  return shouldLoadGame && isAuthenticated ? (
    gameState ? (
      <div className="gb-main-div">
        <div>
          {!isEnd && (
            <div>
              <div>
                <h1>
                  {userData["nick"]} vs {opponentData["nick"]}
                </h1>
              </div>
              {userData["isTheirRound"] ? (
                <div>Your move</div>
              ) : (
                <div>{opponentData["nick"]}'s move</div>
              )}
            </div>
          )}

          {isEnd && winner && (
            //TODO: recognize which player has won
            <div>
              <h1>Player {winner} has won!</h1>
            </div>
          )}
          {isEnd && !winner && (
            //TODO: recognize which player has won
            <div>
              <h1>{gameResult}</h1>
            </div>
          )}
          <div>Your mark: {mark}</div>
          <div className="gb-game-board">
            {gameState.map((value, index) => (
              <div
                className="gb-tile-div"
                onClick={
                  () => {
                    if (
                      gameState[index] === "" &&
                      userData["isTheirRound"] &&
                      !isEnd
                    ) {
                      makeAMove(index);
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
                }
              >
                <GameTile value={gameState[index]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <WaitForGame nick={nick} />
    )
  ) : isAuthenticated ? (
    <button
      onClick={() => {
        setShouldLoadGame(true);
        sendJsonMessage({ option: "loadGame" });
      }}
    >
      Load game
    </button>
  ) : (
    <div>
      <h1>
        You could not be authenticated or server connection could not be
        established
      </h1>
      <h1>Try to sign in again</h1>
    </div>
  );
}

export default GameBoard;
