import { Redirect, Route } from "react-router";

import configuration from "../../utils/config";

const PrivateRoute = (props: any) => {
    /**
     * @description Rerouting helper component to protect routes. This component will verify the user and either
     * redirect the user to the route or to login screen
     *          
     * @verifcations user in state | authToken present | auth token valid
     */

    const { component: Component, ...rest } = props;
    const authenticated = window.localStorage.getItem("authenticated") === "true"
    return(
        <Route 
        { ...rest }
        render={elem => 
            authenticated ? (
                <Component {...elem} />
            ) : (
                <Redirect to={{ pathname: configuration["url-login"], state: {from: elem.location} }} />
            )} 
        
        />
    )
};

export default PrivateRoute;