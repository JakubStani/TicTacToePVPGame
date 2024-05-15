import "./App.css";
import GameBoard from "./screens/GameBoard/GameBoard.js";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import SignIn from "./screens/SignIn/SignIn.js";
import SignUp from "./screens/SignUp/SignUp.js";

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const uuidv4 = require("uuid").v4;

//unique id for client
const uuid = uuidv4();

// const WS_URL='ws://127.0.0.1:8000'
function App() {
  const [isAuthenticationRequested, setIsAuthenticationRequested] =
    useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [nick, setNick] = useState("");
  const [wsConnection, setWsConnection] = useState();
  const ipAddress = window.location.hostname;
  console.log("Adres IP instancji EC2:", ipAddress);
  const [WS_URL, setWS_URL] = useState(`wss://${ipAddress}:443`);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveUserCredentials = (accessToken, refreshToken) => {
    localStorage.setItem(`accessToken-tttpvp-${uuid}`, accessToken);
    localStorage.setItem(`refreshToken-tttpvp-${uuid}`, refreshToken);
  };

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: {},
    share: true,
  });

  window.addEventListener("beforeunload", (ev) => {
    removeLocalStorageGameItems();
  });

  const removeLocalStorageGameItems = () => {
    localStorage.removeItem(`accessToken-tttpvp-${uuid}`);
    localStorage.removeItem(`refreshToken-tttpvp-${uuid}`);
  };

  const logOut = () => {
    setShowSignIn(true);
    setIsAuthenticated(false);
    setIsAuthenticationRequested(false);
    removeLocalStorageGameItems();
  };

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (
        lastJsonMessage["kind"] == "signInAnswer" ||
        lastJsonMessage["kind"] == "refreshTokenAnswer"
      ) {
        if (
          lastJsonMessage["data"] != null &&
          lastJsonMessage["error"] == null
        ) {
          setIsAuthenticated(true);
          const data = lastJsonMessage["data"];
          console.log("saving new credentials");
          saveUserCredentials(data["accessToken"], data["refreshToken"]);
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
          } else {
            console.error("Error:", lastJsonMessage["error"]);
          }
        } else {
          if (lastJsonMessage["kind"] == "sessionNotValid") {
            console.log(
              "Session is not valid. Sending refresh token request ..."
            );
            funUseRefreshToken();
          }
        }
      }
    }
  }, [lastJsonMessage]);

  const funUseRefreshToken = () => {
    const refreshToken = localStorage.getItem(`refreshToken-tttpvp-${uuid}`);
    if (refreshToken != null) {
      sendJsonMessage({
        option: "useRefreshToken",
        refreshToken: refreshToken,
      });
    }
    return false;
  };

  const confirmCode = (nick, confirmationCode) => {
    sendJsonMessage({
      option: "confirmRegistration",
      nick: nick,
      confirmationCode: confirmationCode,
    });
    console.log("sending ", confirmationCode);
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
              uuid={uuid}
              logOut={logOut}
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
              confirmCode={confirmCode}
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
