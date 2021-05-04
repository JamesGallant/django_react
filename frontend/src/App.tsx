import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import UsersActivatePage from "./pages/activateAccount"


const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
      <Route path="/auth/activate/:uid/:token/" exact component={UsersActivatePage} />
      
    </Switch>
  </BrowserRouter>
);

export default App;
