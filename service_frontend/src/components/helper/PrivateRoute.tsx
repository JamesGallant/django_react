import React, { FC, useState } from "react";
import { Redirect, Route } from "react-router";
import configuration from "../../utils/config";

const PrivateRoute = (props: any): JSX.Element => {
    /**
     * @description Rerouting helper component to protect routes. This component will verify the user and either
     * redirect the user to the route or to login screen
     * 
     * @verifcations user in state | authToken present | auth token valid
     */

    const { component: Component, ...rest } = props;

    const [isauthenticated, setAuthentication] = useState(false);

    return(
        <Route 
        { ...rest }
        render={elem => 
            isauthenticated ? (
                <Component {...elem} />
            ) : (
                <Redirect to={{ pathname: configuration["url-login"], state: {from: elem.location} }} />
            )} 
        
        />
    )
};

export default PrivateRoute;