import React, { FC } from "react";

import { useAppSelector } from "../../../store/hooks";
import { selectVeiwDashboard } from "../../../store/slices/viewSlice";

const ProfileView: FC = (): JSX.Element | null => {
	const dashboardView = useAppSelector(selectVeiwDashboard);

	if(dashboardView.profile) {
		return (
			<h1>Profile Information</h1>
		);
	} else {
		return(null);
	}
};

export default ProfileView;