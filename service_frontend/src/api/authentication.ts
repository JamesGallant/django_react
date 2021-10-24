import axios from "axios";
import { AxiosResponse } from "axios";

import configuration from "../utils/config";

import type { UserDataInterface } from "../types/authentication";
import { setTimeout } from "timers";

export async function postRegisterUser(data: UserDataInterface ): Promise<AxiosResponse> {
	/**
     * @description API sends user data to the backend to create a user account. This call also sends a email to the user that is handled internally.
     * 
     * @param data Data from a useState react hook containing the registerComponent inputs. 
     * 
     * @returns Promise that resolves to status code and data
     */

	try {
		const response: AxiosResponse = await axios({
			method: "post",
			url: configuration["api-base"].concat(configuration["api-createAccount"]),
			data: data, 
			headers: {"Content-type": "application/json"}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

export async function postSendEmail(email: string): Promise<AxiosResponse> {
	/**
     * @description sends link containing a uid/token to the users email. This call is used when resending the email, the first email is sent on registration
     *              configured by the backend. This link has the data used by postActivateUserAccount.
     * 
     * @param email: The users email. 
     * @returns Promise that resolves to status code
     */
	try {
		const response: AxiosResponse = await axios({
			method: "post", 
			url: configuration["api-base"].concat(configuration["api-resendActivationEmail"]),
			data: {email: email},
			headers: {"Content-type": "application/json"}
		});
		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}

export async function postActivateUserAccount(uid: string, token: string): Promise<AxiosResponse> {
	/**
     * @description makes a API call to the backend when user clicks on the link in their email. Link contains a uid and token that is passed as data
     * 
     * @param uid userID from the link in the email
     * @param token token from the link in the emal
     * 
     * @returns Promise that resolves to status code
     */
	try {
		const response: AxiosResponse = await axios({
			method: "post", 
			url: configuration["api-base"].concat(configuration["api-activateAccount"]),
			data: {"uid": uid, "token": token},
			headers: {"Content-type": "application/json"}
		});
		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}

export async function postTokenLogout(authToken: string): Promise<AxiosResponse> {
	/**
     * @description logs out a user from the djoser backend. 
     *
     * @statusCodes 204 No content
     * 
     * @returns Promise resolves to response or err.response
     */
	try {
		const response: AxiosResponse = await axios({
			method: "post",
			url: configuration["api-base"].concat(configuration["api-tokenLogout"]),
			headers: {"Authorization": `Token ${authToken}`} 
		});

		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}

export async function postTokenLogin(email: string, password: string): Promise<AxiosResponse> {
	/**
     * @description logs in a user by sending their email (username field) and password via ajax calls using axios. 
     *
     * @statusCodes 200 Okay
     * 
     * @returns Promise resolves to response or err.response
     */
	try {
		const response: AxiosResponse = await axios({
			method: "post",
			url: configuration["api-base"].concat(configuration["api-tokenLogin"]),
			data: {email: email, password: password},
			headers: {"Content-type": "application/json"}
		});
		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}

export async function getUserData(authToken: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "get",
			url: configuration["api-base"].concat(configuration["api-getUserData"]),
			headers: {"Authorization": `Token ${authToken}`}
		});
		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}

export async function resetPassword(email: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "post",
			url: configuration["api-base"].concat(configuration["api-resetPassword"]),
			data: {"email": email},
			headers: {"Content-type": "application/json"}
		});
		return response;
		/* eslint-disable*/
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}
export async function getIsActiveUser(authToken: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "get",
			url: configuration["api-base"].concat(configuration["api-isActiveUser"]),
			headers: {"Authorization": `Token ${authToken}`}
		});
		return response;
		/* eslint-disable */
	} catch(error: any) {
		/* eslint-enable */
		return error.response;
	}
}