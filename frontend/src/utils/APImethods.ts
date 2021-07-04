import axios from "axios";

import configuration from "./config";

class accountsClient  {
    /**
     * @description API calls are defined and handled here using asynchronous functions with axios specific to the user accounts backend. Handles Djoser endpoints
     */

    public async registerUser(data: any) {
        /**
         * @description API sends user data to the backend to create a user account. This call also sends a email to the user that is handled internally.
         * 
         * @param data Data from a useState react hook containing the registerComponent inputs. 
         * 
         * @returns Promise that resolves to status code and data
         */

        try {

            const response = await axios({
                method: "post",
                url: configuration['api-base'].concat(configuration["api-createAccount"]),
                data: data, 
                headers: {'Content-type': 'application/json'}
            })
            return {status: response.status, data: response.data}
        } catch(err) {
            return {status: err.response.status, data: err.response.data}
        };
    }

    public async sendEmail(email: string) {
        /**
         * @description sends link containing a uid/token to the users email. This call is used when resending the email, the first email is sent on registration
         *              configured by the backend. This link has the data used by this.activateUserAccount.
         * 
         * @param email: The users email. 
         * @returns Promise that resolves to status code
         */

        try {
            const response = await axios({
                method: "post", 
                url: configuration['api-base'].concat(configuration["api-resendActivationEmail"]),
                data: {email: email},
                headers: {'Content-type': 'application/json'}
            });
            return response.status

        } catch(err) {
            return err.response.status

        }
    }
    public async activateUserAccount(uid: string, token: string) {
        /**
         * @description makes a API call to the backend when user clicks on the link in their email. Link contains a uid and token that is passed as data
         * 
         * @param uid userID from the link in the email
         * @param token token from the link in the emal
         * 
         * @returns Promise that resolves to status code
         */
        try {
            const response = await axios({
                                        method: "post", 
                                        url: configuration["api-base"].concat(configuration["api-activateAccount"]),
                                        data: {'uid': uid, 'token': token},
                                        headers: {'Content-type': 'application/json'}
                                    });
            
            return response.status
        } catch(err) {
            return err.response.status
        };
    };

    public async tokenLogin(email: string, password: string) {
        /**
         * @description logs in a user by sending their email (username field) and password via ajax calls using axios. 
         *
         * @statusCodes 200 Okay
         * 
         * @returns Promise resolves to response or err.response
         */
        try {
            const response = await axios({
                method: "post",
                url: configuration["api-base"].concat(configuration["url-tokenLogin"]),
                data: {email: email, password: password},
                headers: {'Content-type': 'application/json'}
            });
            return response
        } catch(err) {
            return err.response
        };
    }
};

export {
    accountsClient
};