import React, { useEffect, FC } from "react";
import { useHistory } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setUser, selectUserStateStatus } from "../store/slices/userSlice";

import { Box, Grid } from "@mui/material"; 

import BasicSpinner from "../components/common/spinner/basicSpinnerComponent";
import Navbar from "../components/dashboard/Navbar";
import SettingsMain from "../components/dashboard/SettingsMain";
import AppStore from "../components/dashboard/AppStore";
import Profile from "../components/dashboard/Profile";

import CookieHandler from "../modules/cookies";
import configuration from "../utils/config";
import { logout } from "../modules/authentication";


const DashboardView: FC = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useAppDispatch();
	const userStateStatus: string = useAppSelector(selectUserStateStatus);

	useEffect(() => {
		const setUserState = async () => {
			const cookies: CookieHandler = new CookieHandler();
			const token: string = cookies.getCookie("authToken");
			if (token === "" || token === undefined) {
				logout();
				history.push(configuration["url-login"]);
			} else {
				const result = await dispatch(setUser(token));
				console.log(result);
				if (result.meta.requestStatus === "rejected" || result.payload.detail) {
					logout();
					history.push(configuration["url-login"]);
				}
			}
		};
		
		setUserState();
	}, [dispatch]);

	if (userStateStatus === "loading") {
		return(
			<BasicSpinner />
		);
	} else {
		return(
			<div>
				<Box>
					<Navbar />
					<Grid container sx={{position: "fixed"}} spacing={1}>]
						<Grid item xs={12}>
							<SettingsMain />
							<AppStore />
							<Profile/>
						</Grid>
					</Grid>
				</Box>
			</div>
		);
	}
};

export default DashboardView;