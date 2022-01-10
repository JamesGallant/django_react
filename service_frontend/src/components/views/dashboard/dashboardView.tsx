import React, { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { getUser, selectUserStateStatus } from "../../../store/slices/userSlice";
import { Routes, Route } from "react-router-dom";
import { Box, Grid } from "@mui/material"; 

import BasicCenteredSpinner from "../../common/spinner/basicCenteredSpinner";
import Navbar from "../../dashboard/Navbar";
import SettingsMain from "./settingsView";
import AppStoreMain from "./appStoreView";
import ProfileMain from "./profileView";

import CookieHandler from "../../../modules/cookies";
import configuration from "../../../utils/config";
import { logout } from "../../../modules/authentication";

// import { styled } from "@mui/material";

// const StyledIframe = styled("iframe")({
// 	display: "block",
// 	border: "none",
// 	height: "100vh",
// 	width: "100%",
// });

const DashboardView: FC = (): JSX.Element => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const userStateStatus: string = useAppSelector(selectUserStateStatus);

	useEffect(() => {
		const setUserState = async () => {
			const cookies: CookieHandler = new CookieHandler();
			const token: string = cookies.getCookie("authToken");
			
			if (token === "" || token === undefined) {
				logout();
				navigate(configuration["url-login"]);
			} else {
				const result = await dispatch(getUser(token));
				if (result.meta.requestStatus === "rejected" || result.payload.detail || result.payload.email === "") {
					logout();
					navigate(configuration["url-login"]);
				}
			}
		};
		
		setUserState();
	}, [dispatch]);

	if (userStateStatus === "loading") {
		return(
			<BasicCenteredSpinner />
		);
	} else {
		return(
			<div>
				<Box>
					<Navbar />
					<Grid container sx={{position: "fixed"}} spacing={1}>]
						<Grid item xs={12}>
							<Box sx={{maxHeight: "87vh", overflow: "auto" }}>
								<Routes>
									<Route path={ configuration["url-dashboard-home"] } element={ <AppStoreMain />} />
									<Route path={ configuration["url-dashboard-settings"] } element={ <SettingsMain />} />
									<Route path={ configuration["url-dashboard-profile"] } element={ <ProfileMain />} />
									{/* <Route path="testPlugin" element={ <StyledIframe src="https://www.jamesgallant.nl/" />} /> */}
								</Routes>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</div>
		);
	}
};

export default DashboardView;