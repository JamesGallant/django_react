import React, { useEffect, FC } from "react";
import { useHistory } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setUser, selectUserData, selectUserStateStatus } from "../store/slices/userSlice";

import BasicSpinner from "../components/common/spinner/basicSpinnerComponent";
import Navbar from "../components/dashboard/Navbar";

import CookieHandler from "../modules/cookies";
import configuration from "../utils/config";
import { logout } from "../modules/authentication";

const DashboardView: FC = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUserData);
	const userStateStatus = useAppSelector(selectUserStateStatus);

	useEffect(() => {
		const setUserState = async () => {
			const cookies: CookieHandler = new CookieHandler();
			const token: string = cookies.getCookie("authToken");
			if (token === "" || token === undefined) {
				logout();
				history.push(configuration["url-login"]);
			} else {
				const result = await dispatch(setUser(token));
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
			<Navbar />
		);
	}
};

export default DashboardView;