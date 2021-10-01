import configuration from "../utils/config";
import CookieHandler from "./cookies";

import type { cookieDataType } from "../types/types";
import { AxiosResponse } from "axios";
import { postTokenLogout, getIsActiveUser } from "../api/authentication";

export const logout = async (): Promise<void> => {
	const cookies = new CookieHandler();

	const authToken: string = cookies.getCookie("authToken");

	if (authToken === "" || authToken === "deleted") return;
    
	const logoutResponse: AxiosResponse = await postTokenLogout(authToken);
   
	if (logoutResponse.status === 204) {
		cookies.deleteCookie("authToken");
		window.localStorage.setItem("authenticated", "false");
	}
};

export const login = async (): Promise<void> => {
	const cookies = new CookieHandler();
	const authToken: string = cookies.getCookie("authToken");

	if (authToken === "") {
		window.localStorage.setItem("authenticated", "false");
	} else {
		// auth token present
		const response: AxiosResponse = await getIsActiveUser(authToken);
		const userData = response.data;

		// unsuccesfull use of token block login
		if (userData["detail"]) {
			window.localStorage.setItem("authenticated", "false");
			cookies.deleteCookie("authToken");
		} else {
			// successfully retrieved data
			// user Is no longer active
			if(!userData["message"].is_active) {
				window.localStorage.setItem("authenticated", "false");
				cookies.deleteCookie("authToken");
			} else {
				// user is active
				const lastServerLogin: Date = new Date (userData["message"].last_login);
				const currentLogin: Date = new Date();
				const diffInLogin: number = currentLogin.getMonth() - lastServerLogin.getMonth();
				console.log(lastServerLogin);
				// user has not loggen in a long time
				if (diffInLogin > configuration["misc-loginDurationMonths"]) {
					
					window.localStorage.setItem("authenticated", "false");
					cookies.deleteCookie("authToken");
				} else {
					// login allowed
					
					window.localStorage.setItem("authenticated", "true");

					const cookiePayload: cookieDataType = {
						name: "authToken",
						value: authToken,
						duration: configuration["cookie-maxAuthDuration"],
						path: "/",
						secure: true
					};
		
					cookies.setCookie(cookiePayload);
				}
			}
		}
	}
};