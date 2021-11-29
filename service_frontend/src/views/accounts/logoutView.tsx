import { FC, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectSiteConfigData } from "../../store/slices/siteConfigurationSlice";

import configuration from "../../utils/config";
import { logout } from "../../modules/authentication";

import type { SiteConfigDataInterface } from "../../types/store";
const LogoutView: FC = () => {
	const history = useHistory();
	const siteConfig: SiteConfigDataInterface = useAppSelector(selectSiteConfigData);

	useEffect(() => {
		if(siteConfig.data.clearLoginCache) {
			let authStorageStatus: string | null;
			logout().then(() => {
				authStorageStatus = window.localStorage.getItem("authenticated");
				if (authStorageStatus === "false") {
					history.push(configuration["url-home"]);
				}
			});
		} else {
			history.push(configuration["url-home"]);
		}
	}, []);

	return(
		null
	);
};

export default LogoutView;