import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EnterNick from "./screens/EnterNick/EnterNick.tsx";
import GameBoard from "./screens/GameBoard/GameBoard.js";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import SignIn from "./screens/SignIn/SignIn.js";
import SignUp from "./screens/SignUp/SignUp.js";
import UserPool from "./auth/UserPool.js";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

// const WS_URL='ws://127.0.0.1:8000'
function App() {
  const [isAuthenticationRequested, setIsAuthenticationRequested] =
    useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [nick, setNick] = useState("");
  const [wsConnection, setWsConnection] = useState();
  const ipAddress = window.location.hostname;
  console.log("Adres IP instancji EC2:", ipAddress);
  const [WS_URL, setWS_URL] = useState(`ws://${ipAddress}:8000`);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveUserCredentials = (idToken, accessToken, refreshToken) => {
    localStorage.setItem("idToken-tttpvp", idToken);
    localStorage.setItem("accessToken-tttpvp", accessToken);
    localStorage.setItem("refreshToken-tttpvp", refreshToken);
  };

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: {},
    share: true,
  });

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (
        lastJsonMessage["kind"] == "signInAnswer" ||
        lastJsonMessage["kind"] == "refreshTokenAnswer"
      ) {
        setIsAuthenticated(true);
        if (lastJsonMessage["data"] != null) {
          const data = lastJsonMessage["data"];
          saveUserCredentials(
            data["idToken"],
            data["accessToken"],
            data["refreshToken"]
          );
          if (!isAuthenticationRequested) {
            setIsAuthenticationRequested(true);
          }
          if (!showSignIn) {
            setShowSignIn(true);
          }
        } else {
          console.error(lastJsonMessage["error"]);
        }
      } else {
        if (lastJsonMessage["kind"] == "signUpAnswer") {
          if (lastJsonMessage["error"] == null) {
            setShowSignIn(true);
          }
        }
      }
    }
  }, [lastJsonMessage]);

  const useRefreshToken = () => {
    let refreshToken = localStorage.getItem("refreshToken-tttpvp");
    if (refreshToken != null) {
      sendJsonMessage({
        option: "useRefreshToken",
        refreshToken: refreshToken,
      });
    }
    return false;
  };

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
          {isAuthenticationRequested ? (
            <GameBoard
              nick={nick}
              WS_URL={WS_URL}
              lastJsonMessage={lastJsonMessage}
              sendJsonMessage={sendJsonMessage}
              isAuthenticated={isAuthenticated}
            />
          ) : showSignIn ? (
            <SignIn
              isAuthenticated={isAuthenticationRequested}
              setIsAuthenticated={setIsAuthenticationRequested}
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
              saveUserCredentials={saveUserCredentials}
              lastJsonMessage={lastJsonMessage}
              sendJsonMessage={sendJsonMessage}
            />
          ) : (
            <SignUp
              isAuthenticated={isAuthenticationRequested}
              setIsAuthenticated={setIsAuthenticationRequested}
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
              saveUserCredentials={saveUserCredentials}
              lastJsonMessage={lastJsonMessage}
              sendJsonMessage={sendJsonMessage}
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
