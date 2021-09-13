import configuration from "../utils/config";
import { accountsClient } from "./APImethods";
import CookieHandler from "./cookies";

import type { cookieDataType } from "../types/types";
import { AxiosResponse } from "axios";

export const logout = async () => {
    const cookies = new CookieHandler();
    const client = new accountsClient();

    const authToken: string = cookies.getCookie("authToken");

    if (authToken === "" || authToken === "deleted") return;
    
    const logoutResponse: AxiosResponse = await client.tokenLogout(authToken);
   
    if (logoutResponse.status === 204) {
        cookies.deleteCookie("authToken");
        window.localStorage.setItem("authenticated", "false");
    };
};

export const login = async () => {
    const cookies = new CookieHandler();
    const client = new accountsClient();
    const authToken: string = cookies.getCookie("authToken");

    if (authToken === "") {
        window.localStorage.setItem("authenticated", "false")
    } else {
        // auth token present
        const userData = await client.getUserData(authToken);

        // unsuccesfull use of token
        if (userData["detail"]) {
            window.localStorage.setItem("authenticated", "false")
            cookies.deleteCookie("authToken")
        } else {
            // successfully retrieved data
            console.log(userData) // add to state
            console.log("TODO add userdata to state, from authenticate.ts")
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