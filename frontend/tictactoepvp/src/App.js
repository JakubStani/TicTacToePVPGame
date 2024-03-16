import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EnterNick from './screens/EnterNick/EnterNick.tsx';
import GameBoard from './screens/GameBoard/GameBoard.tsx';

function App() {
  return (
    <Router>
      <div className="App">
        <div className='content'>
          <header className="App-header">
            <Routes>
              <Route exact path='/' element={<EnterNick />} />
              <Route exact path='/game' element={<GameBoard />} />
            </Routes>
          </header>
        </div>
      </div>
    </Router>
  );
}

export default App;
