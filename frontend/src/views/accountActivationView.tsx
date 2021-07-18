import { FC, useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';

import configuration from "../utils/config";
import { accountsClient } from "../utils/APImethods";

const AccountActivationView: FC = () => {
    /**
     * @resource https://reactjs.org/docs/faq-ajax.html#gatsby-focus-wrapper
     */
    
     interface ParamTypes {
        uid: string,
        token: string,
    };
    
    const { uid, token } = useParams<ParamTypes>();
    const [statusCode, setStatusCode] = useState(0)
    const history = useHistory();

    // api calls using useEffect hook
    // Note: the empty deps array [] means it will run once after react updates the DOM, otherwise the email is sent twice.
    useEffect(() => {
        let client = new accountsClient()
        const getStatus = client.activateUserAccount(uid, token);
        getStatus.then((status) => setStatusCode(status))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    switch (statusCode) {
        case 204: {
            // no content, account created successfully
            history.push(configuration["url-login"])
            break;
        }
        case 403: {
            // forbidden, account is active
            history.push(configuration["url-login"])
            break;
        }
        
        case 400: {
            // no account exists, need to re-register
            history.push(configuration["url-register"])
            break;
        }
    };
    
    return(
        null
    )
};

export default AccountActivationView;