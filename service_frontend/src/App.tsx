import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import configuration from "./utils/config";
import PrivateRoute from "./components/common/helper/privateRoute";
import views from "./views";

const theme = createTheme({
});

const App = (): JSX.Element => {
	return(
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Switch>
					<Route exact path={ configuration["url-home"] } component={views.HomeView}/>
					<Route exact path={ configuration["url-login"] } component={views.LoginView}/>
					<Route exact path={ configuration["url-logout"] } component={views.LogoutView}/>
					<Route exact path={ configuration["url-register"] } component={views.RegisterView}/>
					<Route path={ configuration["url-accountCreated"] } exact component={views.AccountCreatedView}/>
					<Route path= { configuration["url-acitvateAccount"] } exact component={views.AccountActivationView}/>
					<Route exact path={ configuration["url-resetPassword"] } component={views.ResetPassword}/>
					<Route exact path={ configuration["url-resetPasswordConfirm"] } component={views.ResetPasswordConfirm}/>
					<Route exact path={ configuration["url-resetPasswordEmailSent"]} component={views.ResetPasswordEmailSent}/>
					<PrivateRoute path={ configuration["url-dashboard"] } component={views.DashboardView}/>
				</Switch>
			</BrowserRouter>
		</ThemeProvider>

	);
};

export default App;
