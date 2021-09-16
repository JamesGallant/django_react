import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import configuration from './utils/config';
import PrivateRoute from './components/helper/privateRoute';
// import HomeView from "./views/homeView"
// import AccountActivationView from "./views/accounts/accountActivationView"
// import RegisterView from "./views/accounts/registerView";
// import LoginView from "./views/accounts/loginView";
// import LogoutView from './views/accounts/logoutView';
// import AccountCreatedView from './views/accounts/accountCreatedView';
// import DashboardView  from './views/dashboardView';
import views from './views';

const App = () => {
  return(
    <BrowserRouter>
    <Switch>
      <Route exact path={ configuration["url-home"] } component={views.HomeView} />
      <Route exact path={ configuration["url-login"] } component={views.LoginView} />
      <Route exact path={ configuration["url-logout"] } component={views.LogoutView} />
      <Route exact path={ configuration["url-register"] } component={views.RegisterView} />
      <PrivateRoute path={ configuration["url-dashboard"] } component={views.DashboardView} />
      <PrivateRoute path={ configuration["url-statisticsApplication"] } component={views.ApplicationStatisticsView} />
      <Route path={ configuration["url-accountCreated"] } exact component={views.AccountCreatedView} />
      <Route path= { configuration["url-acitvateAccount"] } exact component={views.AccountActivationView} />
    </Switch>
  </BrowserRouter>
  );
};

export default App;
