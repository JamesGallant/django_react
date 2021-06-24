import React, { FC } from "react"
import { useLocation, useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';

import configuration from '../utils/config';

interface stateType {
    email: string, 
    firstName: string,
 };

const AccountCreatedPage : FC = () => {
    /**
     * @description Redirects user to login or register based on the email link. to login if account creation is successfull or the account exists, to
     * register if the account is deleted or password is mangled. 
     * 
     * @Resource https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-resend-activation-e-mail
     */

    const location = useLocation<stateType>();
    const history = useHistory();

    const email = location.state.email;
    const firstName = location.state.firstName;

    const resendEmail = () => {
          axios({
            method: "post",
            url: configuration['api-base'].concat(configuration["api-resendActivationEmail"]),
            data: {email: email},
            headers: {'Content-type': 'application/json'}
          })
          .then(function (response: AxiosResponse) {
              if (response?.status === 204) {
                alert(`email sent to ${email}`)
              } else {
                  throw new Error("Status code not valid, options are 400 or 204. See Djoser docs on activation emails")
              }
        })
        .catch(function (error: AxiosError) {
            console.log(error.response)
            if (error.response?.status === 400) {
                history.push(configuration["url-login"])
            } else {
                throw new Error("Status code not valid, options are 400 or 204. See Djoser docs on activation emails")
            }
          });
    }

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

export default AccountCreatedPage;