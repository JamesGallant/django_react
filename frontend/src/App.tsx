import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/home"
import UsersActivate from "./pages/users_activate"


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/activate/:uid/:token/" exact component={UsersActivate} />
        
      </Switch>
    </BrowserRouter> )
};

export default App;
