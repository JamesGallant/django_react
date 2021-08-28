import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import configuration from './utils/config';
import PrivateRoute from './components/helper/PrivateRoute';
import HomeView from "./views/homeView"
import AccountActivationView from "./views/accountActivationView"
import RegisterView from "./views/registerView";
import LoginView from "./views/loginView";
import AccountCreatedView from './views/accountCreatedView';
import DashboardView  from './views/dashboardView';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={ configuration["url-home"] } component={HomeView} />
      <Route exact path={ configuration["url-login"] } component={LoginView} />
      <Route exact path={ configuration["url-register"] } component={RegisterView} />
      <PrivateRoute exact path={ configuration["url-dashboard"] } component={DashboardView} />
      <Route path={ configuration["url-accountCreated"] } exact component={AccountCreatedView} />
      <Route path= { configuration["url-acitvateAccount"] } exact component={AccountActivationView} />
    </Switch>
  </BrowserRouter>
);

export default App;
