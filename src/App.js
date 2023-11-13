import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./routes/Login";
import Lobby from "./routes/Lobby";
import InGame from "./routes/InGame";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/InGame">
          <InGame />
        </Route>
        <Route path="/lobby">
          <Lobby />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
