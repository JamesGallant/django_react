import React, { FC } from "react";

import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

const ProfileMain: FC = (): JSX.Element | null => {
	const dashboardView = useAppSelector(selectVeiwDashboard);

	if(dashboardView.profile) {
		return (
			<div>Profile Information</div>
		);
	} else {
		return(null);
	}
};

export default ProfileMain;