import configuration from "../utils/config";
import { getUserData } from "../api/authentication";
import CookieHandler from "./cookies";

import type { cookieDataType } from "../types/types";
import { AxiosResponse } from "axios";
import { postTokenLogout } from "../api/authentication";

export const logout = async () => {
    const cookies = new CookieHandler();

    const authToken: string = cookies.getCookie("authToken");

    if (authToken === "" || authToken === "deleted") return;
    
    const logoutResponse: AxiosResponse = await postTokenLogout(authToken);
   
    if (logoutResponse.status === 204) {
        cookies.deleteCookie("authToken");
        window.localStorage.setItem("authenticated", "false");
    };
};

export const login = async () => {
    const cookies = new CookieHandler();
    const authToken: string = cookies.getCookie("authToken");

    if (authToken === "") {
        window.localStorage.setItem("authenticated", "false")
    } else {
        // auth token present
        const response: AxiosResponse = await getUserData(authToken);
        const userData = response.data;

        // unsuccesfull use of token
        if (userData["detail"]) {
            window.localStorage.setItem("authenticated", "false")
            cookies.deleteCookie("authToken")
        } else {
            // successfully retrieved data
            window.localStorage.setItem("authenticated", "true");
            // extendCookies
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