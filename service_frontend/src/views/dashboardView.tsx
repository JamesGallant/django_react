import React, { useEffect, FC } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectUserStateStatus, setUser, selectUserData, selectUserReducer } from "../store/slices/userSlice";
import CookieHandler from "../modules/cookies";
import configuration from "../utils/config";
import { logout } from "../modules/authentication";

const DashboardView: FC = (): JSX.Element => {
	const history = useHistory();
	// const cookies = new CookieHandler();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUserData);

	useEffect(() => {

		const setUserState = async () => {
			const cookies = new CookieHandler();
			const token = cookies.getCookie("authToken");
			if (token === "" || token === undefined) {
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

	return(
		<div>
			{/* <Button onClick={handleClick}>Know me</Button> */}
			<h1> Hello {user.first_name} Welcome to the dash</h1>
		</div>
		
	);
};

export default DashboardView;