import { FC, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import axios from 'axios';

import AccountActivation from '../components/accountActivationComponent'

const UsersActivatePage: FC = () => {
    /**
     * @resource https://reactjs.org/docs/faq-ajax.html#gatsby-focus-wrapper
     */
    
     interface ParamTypes {
        uid: string,
        token: string,
    };
    
    const { uid, token } = useParams<ParamTypes>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [statusCode, setStatusCode] = useState(0)


    // api calls using useEffect hook
    // Note: the empty deps array [] means it will run once after react updates the DOM, otherwise the email is sent twice.
    useEffect(() => {
         // sends post request to djoser activation url on the backend.
        setIsLoaded(true);
        axios({
            method: "post",
            url: `${process.env.REACT_APP_BASE_API_ACCOUNTS}/${process.env.REACT_APP_API_ACCOUNT_ACTIVATION}`,
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
    
    return(
        <AccountActivation isComponentLoaded={isLoaded} status={statusCode}/>
    )
};

export default UsersActivatePage