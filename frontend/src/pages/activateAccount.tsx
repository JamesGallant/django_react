import { FC, useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';

import axios from 'axios';

import configuration from "../utils/config";

const UsersActivatePage: FC = () => {
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
         // sends post request to djoser activation url on the backend.
        axios({
            method: "post",
            url: configuration["api-base"].concat(configuration["api-activateAccount"]),
            data: {'uid': uid, 'token': token},
            headers: {'Content-type': 'application/json'}
        })
        .then(response => {
            // handle success and errors
            setStatusCode(response.status)
        })
        .catch(error => {
            // handle error
            var errorStatusCode: number = error.response.status
            setStatusCode(errorStatusCode)
        });
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

export default UsersActivatePage