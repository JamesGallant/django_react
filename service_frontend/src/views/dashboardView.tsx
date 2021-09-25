import { FC } from "react";
import { useHistory } from "react-router-dom";

import configuration from "../utils/config";

const DashboardView: FC = (): null => {
	const history = useHistory();
	history.push(configuration["url-statisticsApplication"]);
	return(
		null
	);
};

export default DashboardView;