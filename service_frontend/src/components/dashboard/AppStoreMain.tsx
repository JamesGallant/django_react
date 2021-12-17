import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

const AppStoreMain: FC = (): JSX.Element | null => {
	/**
	 * This component will eventually be an appstore when we have apps. For now rendering the first application
	 */
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