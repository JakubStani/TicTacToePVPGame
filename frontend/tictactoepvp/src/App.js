import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EnterNick from "./screens/EnterNick/EnterNick.tsx";
import GameBoard from "./screens/GameBoard/GameBoard.js";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import SignIn from "./screens/SignIn/SignIn.js";
import SignUp from "./screens/SignUp/SignUp.js";
// const WS_URL='ws://127.0.0.1:8000'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [nick, setNick] = useState("");
  const [wsConnection, setWsConnection] = useState();
  const ipAddress = window.location.hostname;
  console.log("Adres IP instancji EC2:", ipAddress);
  const [WS_URL, setWS_URL] = useState(`ws://${ipAddress}:8000`);

  // axios.get('http://169.254.169.254/latest/meta-data/public-ipv4')
  //     .then(response => {
  //       console.log(`Public IP: ${response.data}`)
  //       setWS_URL(response.data)
  //     })
  //     .catch(error => {
  //       console.log(`error while catching IP data: ${error}`)
  //     })

  // const enterNick = (nick) => {
  //   if(nick!=='') {
  //     setWsConnection(useWebSocket(WS_URL, {
  //       queryParams: {nick},
  //       share: true
  //     }))
  //   }
  // }

  return (
    <div className="App">
      <div className="content">
        <header className="App-header">
          {isAuthenticated ? (
            nick === "" ? (
              <EnterNick nick={nick} setNick={setNick} />
            ) : (
              <GameBoard nick={nick} WS_URL={WS_URL} />
            )
          ) : showSignIn ? (
            <SignIn
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
            />
          ) : (
            <SignUp
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
            />
          )}
        </header>
      </div>
    </div>
  );
}

export default App;

{
  /* <Router>
  <div className="App">
    <div className='content'>
      <header className="App-header">
        <Routes>
          <Route exact path='/' element={<EnterNick nick={nick} setNick={setNick} />} />
          <Route exact path='/game' element={<GameBoard nick={nick}/>} />
        </Routes>
      </header>
    </div>
  </div>
</Router> */
}
