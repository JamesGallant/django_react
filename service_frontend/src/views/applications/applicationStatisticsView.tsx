import React, { useEffect } from "react";
import { FC  } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectUserData, getUser} from "../../store/slices/userSlice";
import CookieHandler from "../../modules/cookies";

const ApplicationStatisticsView: FC = (): JSX.Element => {
	const cookies = new CookieHandler();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const token = cookies.getCookie("authToken");
		dispatch(getUser(token));
	},[]);
	const user = useAppSelector(selectUserData);
	return(
		<h1> Hello Lieve {user.first_name}</h1>
	);
};

export default ApplicationStatisticsView;