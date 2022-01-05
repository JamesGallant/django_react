/* eslint-disable no-mixed-spaces-and-tabs */
import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import configuration from "../../../utils/config";
import { postActivateUserAccount } from "../../../api/authenticationAPI";
import { AxiosResponse } from "axios";

const AccountActivationView: FC = () => {
	/**
     * @resource https://reactjs.org/docs/faq-ajax.html#gatsby-focus-wrapper
     */
    
	const params = useParams();
	const uid = params.uid as string;
	const token = params.token as string;

	const [statusCode, setStatusCode] = useState(0);
	const navigate = useNavigate();
     
	useEffect(() => {
     	const activateUser = async () => {
     		const response: AxiosResponse = await postActivateUserAccount(uid, token);
     		const statusCode: number = response.status;
     		setStatusCode(statusCode);
     	};
     	activateUser();
	}, []);

    
	switch (statusCode) {
	case 204: {
     	// no content, account created successfully
     	navigate(configuration["url-login"]);
     	break;
	}
	case 403: {
     	// forbidden, account is active
     	navigate(configuration["url-login"]);
     	break;
	}
        
	case 400: {
     	// no account exists, need to re-register
     	navigate(configuration["url-register"]);
     	break;
	}
	}
    
	return(
     	null
	);
};

export default AccountActivationView;