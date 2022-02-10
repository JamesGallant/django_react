import React  from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteInterface {
	redirectTo: string
	children: JSX.Element
}
const PrivateRoute = (props: PrivateRouteInterface): JSX.Element => {
	const authenticated = window.localStorage.getItem("authenticated") === "true";
	return authenticated ? props.children : <Navigate to={props.redirectTo} />;
};

export default PrivateRoute;