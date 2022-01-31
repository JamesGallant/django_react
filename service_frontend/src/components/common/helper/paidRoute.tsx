import React  from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectUserApps } from "../../../store/slices/userOwnedAppsSlice";

interface PayedRouteInterface {
	redirectTo: string
	children: JSX.Element
}
const PayedRoute = (props: PayedRouteInterface): JSX.Element => {
	const ownedApps = useAppSelector(selectUserApps);
	const location: any = useLocation();
	const authenticated: boolean = window.localStorage.getItem("authenticated") === "true";
	const payed = ownedApps.results?.some(oa => oa.app === location.state.appID) as boolean;
	return authenticated && payed ? props.children : <Navigate to={props.redirectTo} />;
};

export default PayedRoute;