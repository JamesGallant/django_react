import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import configuration from './utils/config';

import HomeView from "./views/homeView"
import AccountActivationView from "./views/accountActivationView"
import RegisterView from "./views/registerView";
import LoginView from "./views/loginView";
import AccountCreatedView from './views/accountCreatedView';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={ configuration["url-home"] } component={HomeView} />
      <Route exact path={ configuration["url-login"] } component={LoginView} />
      <Route exact path={ configuration["url-register"] } component={RegisterView} />
      <Route path={ configuration["url-accountCreated"] } exact component={AccountCreatedView} />
      <Route path= { configuration["url-acitvateAccount"] } exact component={AccountActivationView} />
      
    </Switch>
  </BrowserRouter>
);

export default App;
