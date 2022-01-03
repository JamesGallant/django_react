import React  from "react";
import { Redirect } from "react-router-dom";

const PrivateRoute = ({ children, redirectTo }: any): JSX.Element => {
	const authenticated = window.localStorage.getItem("authenticated") === "true";
	return authenticated ? children : <Redirect to={redirectTo} />;
};

export default PrivateRoute;