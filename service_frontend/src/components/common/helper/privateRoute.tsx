import React  from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, redirectTo }: any): JSX.Element => {
	const authenticated = window.localStorage.getItem("authenticated") === "true";
	return authenticated ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;