import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EnterNick from './screens/EnterNick/EnterNick.tsx';
import GameBoard from './screens/GameBoard/GameBoard.tsx';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket'
const WS_URL='ws://127.0.0.1:8000'
function App() {
  const [nick, setNick] = useState('')
  const [wsConnection, setWsConnection] = useState()

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
      <div className='content'>
        <header className="App-header">
        {nick==='' ? (
          <EnterNick nick={nick} setNick={setNick} />
        ) : (
          <GameBoard nick={nick}/>
        )}
        </header>
      </div>
    </div>
  )
}

export default App;

{/* <Router>
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
</Router> */}