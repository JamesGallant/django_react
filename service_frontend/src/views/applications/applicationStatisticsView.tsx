import React, { useEffect, FC, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectUserStateStatus, getUser, selectUserData } from "../../store/slices/userSlice";
import CookieHandler from "../../modules/cookies";
import configuration from "../../utils/config";

const ApplicationStatisticsView: FC = (): JSX.Element => {
	const history = useHistory();
	const cookies = new CookieHandler();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUserData);
	const userStateStatus = useAppSelector(selectUserStateStatus);

	useEffect(() => {
		const token = cookies.getCookie("authToken");
		if (token === "" || token === undefined) {
			history.push(configuration["url-login"]);
		} else {
			dispatch(getUser(token));
		}
	},[]);

	useEffect(() => {
		if (userStateStatus === "failed") {
			history.push(configuration["url-login"]);
		}
	}, [userStateStatus]);



	return(
		<h1> Hello {user.first_name}</h1>
	);
};

export default ApplicationStatisticsView;