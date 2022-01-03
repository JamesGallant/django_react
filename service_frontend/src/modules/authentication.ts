import configuration from "../utils/config";
import CookieHandler from "./cookies";
import { AxiosResponse } from "axios";
import { postTokenLogout, getUserData } from "../api/authenticationAPI";

import type { cookieDataType } from "../types/types";

const cleanStorage = (): void => {
	const cookies = new CookieHandler();
	cookies.deleteCookie("authToken");
	window.localStorage.setItem("authenticated", "false");
	window.localStorage.removeItem(`persist:${configuration["persistKey-siteConfiguraton"]}`);
};

export const logout = async (): Promise<void> => {
	const cookies = new CookieHandler();

	const authToken: string = cookies.getCookie("authToken");

	if (authToken === "" || authToken === "deleted") return;
    
	const logoutResponse: AxiosResponse = await postTokenLogout(authToken);
	if (!logoutResponse) {
		//TODO handle server failures
		cleanStorage();
	}
	
	if (logoutResponse.status === 204) {
		cleanStorage();
	}
};

export const login = async (): Promise<void> => {
	const cookies = new CookieHandler();
	const authToken: string = cookies.getCookie("authToken");

	if (authToken === "") {
		window.localStorage.setItem("authenticated", "false");
	} else {
		// auth token present
		const response: AxiosResponse = await getUserData(authToken);
		const userData = response.data;
		// unsuccesfull use of token block login
		if (userData["detail"]) {
			cleanStorage();
		} else {
			// successfully retrieved data
			// user Is no longer active
			if(!userData.is_active) {
				cleanStorage();
			} else {
				// user is active
				const lastServerLogin: Date = new Date (userData.last_login);
				const currentLogin: Date = new Date();
				const diffInLogin: number = currentLogin.getMonth() - lastServerLogin.getMonth();
				
				// user has not loggen in a long time
				if (diffInLogin > configuration["misc-loginDurationMonths"]) {
					cleanStorage();
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