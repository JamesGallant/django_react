import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { createTheme, ThemeProvider, useMediaQuery, CssBaseline } from "@mui/material";

import { useAppSelector, useAppDispatch } from "./store/hooks";
import { selectSiteTheme, setThemeMode } from "./store/slices/siteConfigurationSlice";

import configuration from "./utils/config";
import PrivateRoute from "./components/common/helper/privateRoute";
import views from "./components/views";
import type { ThemePreferenceInterface } from "./types/siteConfigTypes";

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
			<Routes>
				<Route path={ configuration["url-home"] } element={ <views.HomeView /> }/>
				<Route path={ configuration["url-login"] } element={ <views.LoginView /> }/>
				<Route path={ configuration["url-register"] } element={ <views.RegisterView /> }/>
				<Route path={ configuration["url-accountCreated"] } element={ <views.AccountCreatedView /> }/>
				<Route path= { configuration["url-acitvateAccount"] } element={ <views.AccountActivationView /> }/>
				<Route path={ configuration["url-resetPassword"] } element={ <views.ResetPassword /> }/>
				<Route path={ configuration["url-resetPasswordConfirm"] } element={ <views.ResetPasswordConfirm /> }/>
				<Route path={ configuration["url-resetUsernameConfirm"] } element={ <views.ResetUsernameConfirm /> }/>
				<Route path={ configuration["url-resetEmailSent"]} element={ <views.ResetEmailSent /> }/>
				<Route path={ configuration["url-dashboard"] } element={
					<PrivateRoute redirectTo={configuration["url-login"]}>
						<views.DashboardView/>
					</PrivateRoute>
				} />
			</Routes>
		</ThemeProvider>

	);
};

export default App;
