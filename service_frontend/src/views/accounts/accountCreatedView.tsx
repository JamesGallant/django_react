import React, { FC } from "react"
import { useLocation, useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import configuration from '../../utils/config';
import { postSendEmail } from "../../api/authentication";
import { AxiosResponse } from "axios";


interface stateType {
    email: string, 
    firstName: string,
 };

const AccountCreatedView : FC = () => {
    /**
     * @description Redirects user to login or register based on the email link. to login if account creation is successfull or the account exists, to
     * register if the account is deleted or password is mangled. 
     * 
     * @Resource https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-resend-activation-e-mail
     */

    const location = useLocation<stateType>();
    const history = useHistory();

    const email: string = location.state.email;
    const firstName: string = location.state.firstName;

    const resendEmail = async () => {
        const response: AxiosResponse = await postSendEmail(email)
        const statusCode: number = response.status;

        switch(statusCode) {
            case 204: 
                // TODO change to error dialog
                console.log("change to error dialog")
                alert(`email sent to ${email}`)
                break;
            case 400:
                history.push(configuration["url-login"]);
                break;
            default:
                throw new Error("Invalid status code, options are 400 or 200. see: https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-resend-activation-e-mail")
        };
    };

    return(
        <div>
            <h1> Thank you for creating an account with {process.env.REACT_APP_SITE_NAME} </h1>
            <p> Hi { firstName }, thank you for creating an account with us.</p>
            <p>We have sent a email to { email } which contains a link to activate your account. </p>
            <p> Please activate your account before logging in. </p>
            <Button color="primary" onClick={ resendEmail }> Resend activation email </Button>
        </div>
    );
};

export default AccountCreatedView;