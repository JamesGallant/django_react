import React, { useEffect, FC, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectUserStateStatus, getUser, selectUserData } from "../store/slices/userSlice";
import CookieHandler from "../modules/cookies";
import configuration from "../utils/config";

const DashboardView: FC = (): JSX.Element => {
	const history = useHistory();
	const cookies = new CookieHandler();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUserData);
	const userStateStatus = useAppSelector(selectUserStateStatus);

	useEffect(() => {
		/**
		 * This hook is a defensive hook to test if the user forcibly clears cookies at any point, the user will be logged out
		 */
		const token = cookies.getCookie("authToken");
		if (token === "" || token === undefined) {
			history.push(configuration["url-login"]);
		} else {
			dispatch(getUser(token));
		}
	},[]);

	useEffect(() => {
		/**
		 * failed user data means a bad login, this hook reroutes the user to login page
		 */
		if (userStateStatus === "failed") {
			history.push(configuration["url-login"]);
		}
	}, [userStateStatus]);

	return(
		<h1> Hello {user.first_name} Welcome to the dash</h1>
	);
};

export default DashboardView;