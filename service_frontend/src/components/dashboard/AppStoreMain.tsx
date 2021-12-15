import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

const AppStoreMain: FC = (): JSX.Element | null => {
	const dashboardView = useAppSelector(selectVeiwDashboard);

	if(dashboardView.appstore) {
		return (
			<h1>Appstore</h1>
		);
	} else {
		return(null);
	}
};

export default AppStoreMain;