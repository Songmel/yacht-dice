import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Logo from "./assets/Logo.png";

import Login from "./routes/Login";
import Kakao from "./routes/Kakao";
import Lobby from "./routes/Lobby";
import Join from "./routes/Join";
import Matchup from "./routes/Matchup";
import MatchupGuest from "./routes/MatchupGuest";
import InGame from "./routes/InGame";

function App() {
  return (
    <Router>
      <div className="flex flex-col justify-evenly items-center h-screen bg-gradient-to-r from-primary to-secondary animate-gradient-xy">
        <Switch>
          <Route path="/InGame">
            <InGame />
          </Route>
          <Route path="/MatchupGuest">
            <MatchupGuest />
          </Route>
          <Route path="/Matchup">
            <Matchup />
          </Route>
          <Route path="/Join">
            <Join />
          </Route>
          <Route path="/lobby">
            <Lobby />
          </Route>
          <Route path="/Kakao">
            <Kakao />
          </Route>
          <Route path="/">
            <img width={500} src={Logo} alt="Yacht Dice" />
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
