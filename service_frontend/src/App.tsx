import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { createTheme, ThemeProvider, useMediaQuery, CssBaseline } from "@mui/material";

import {useAppSelector, useAppDispatch} from "./store/hooks";
import { selectSiteTheme, setThemeMode } from "./store/slices/siteConfigurationSlice";

import configuration from "./utils/config";
import PrivateRoute from "./components/common/helper/privateRoute";
import views from "./components/views";
import type { ThemePreferenceInterface } from "./types/store";

const App = (): JSX.Element => {
	const systemThemePreference = useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";
	const dispatch = useAppDispatch();
	const siteConfig: ThemePreferenceInterface = useAppSelector(selectSiteTheme);

	useEffect(() => {
		if (siteConfig.setting === "syncTheme") {
			dispatch(setThemeMode(systemThemePreference));
		}
	}, [systemThemePreference]);

	const theme = React.useMemo(() => createTheme({
		palette: {
			mode: siteConfig.mode 
		},
	}), [siteConfig.mode]);
  
	return(
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Switch>
					<Route exact path={ configuration["url-home"] } component={views.HomeView}/>
					<Route exact path={ configuration["url-login"] } component={views.LoginView}/>
					<Route exact path={ configuration["url-register"] } component={views.RegisterView}/>
					<Route path={ configuration["url-accountCreated"] } exact component={views.AccountCreatedView}/>
					<Route path= { configuration["url-acitvateAccount"] } exact component={views.AccountActivationView}/>
					<Route exact path={ configuration["url-resetPassword"] } component={views.ResetPassword}/>
					<Route exact path={ configuration["url-resetPasswordConfirm"] } component={views.ResetPasswordConfirm}/>
					<Route exact path={ configuration["url-resetUsernameConfirm"] } component={views.ResetUsernameConfirm}/>
					<Route exact path={ configuration["url-resetEmailSent"]} component={views.ResetEmailSent}/>
					<PrivateRoute redirectTo={configuration["url-login"]}>
						<views.DashboardView/>
					</PrivateRoute>
				</Switch>
			</BrowserRouter>
		</ThemeProvider>

	);
};

export default App;
