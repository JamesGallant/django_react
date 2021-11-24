import React, { useEffect, FC } from "react";
import { useHistory } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUser, selectUserStateStatus } from "../store/slices/userSlice";

import { Box, Grid } from "@mui/material"; 

import BasicSpinner from "../components/common/spinner/basicSpinnerComponent";
import Navbar from "../components/dashboard/Navbar";
import SettingsMain from "../components/dashboard/SettingsMain";
import AppStoreMain from "../components/dashboard/AppStoreMain";
import ProfileMain from "../components/dashboard/ProfileMain";

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
				const result = await dispatch(getUser(token));
				if (result.meta.requestStatus === "rejected" || result.payload.detail || result.payload.email === "") {
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
							<Box sx={{maxHeight: "87vh", overflow: "auto" }}>
								<SettingsMain />
							</Box>
							<AppStoreMain />
							<ProfileMain/>
						</Grid>
					</Grid>
				</Box>
			</div>
		);
	}
};

export default DashboardView;