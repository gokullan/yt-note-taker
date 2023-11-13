import { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './navbar/Navbar';
import VideoList from './videolist/VideoList';
import Workspace from './workspace/Workspace';
import './App.css';
import Login from './login/Login';

export const UserContext = createContext(null);

function App() {
  // global state for the YT Player
  const [playerState, setPlayerState] = useState(null);
  // global state to display notes
  const [allNotes, setAllNotes] = useState(null);
  
  const context = {
    player: playerState,
    setPlayer: setPlayerState,
    allNotes: allNotes,
    setAllNotes: setAllNotes,
  }

  return (
    <Router>
      <div className='App'>
      <UserContext.Provider value={context}>
        <Navbar></Navbar>
        <Routes>
          {/* Listing */}
          <Route 
          exact path="/"
          element = {<Login />}
          />
          <Route
          exact path='/list'
          element = {<VideoList
            // remove this! 
            usernameProp={'gokula.s'}
          />}
          />
          {/* Workspace */}
          <Route
          exact path="/workspace"
          element = {<Workspace />}
          />
        </Routes>
      </UserContext.Provider>
    </div>
    </Router>
  );
}

export default App;
