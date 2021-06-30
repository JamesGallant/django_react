import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import configuration from './utils/config';

import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import UsersActivatePage from "./pages/activateAccount"
import RegisterPage from "./pages/register";
import AccountCreatedPage from './pages/accountCreated';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={ configuration["url-home"] } component={HomePage} />
      <Route exact path={ configuration["url-login"] } component={LoginPage} />
      <Route exact path={ configuration["url-register"] } component={RegisterPage} />
      <Route path={ configuration["url-accountCreated"] } exact component={AccountCreatedPage} />
      <Route path= { configuration["url-acitvateAccount"] } exact component={UsersActivatePage} />
      
    </Switch>
  </BrowserRouter>
);

export default App;
