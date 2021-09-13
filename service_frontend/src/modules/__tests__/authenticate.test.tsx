import {login} from "../authenticate";
import CookieHandler from "../cookies";
import { accountsClient } from "../APImethods";
import configuration from "../../utils/config";

import type { cookieDataType } from '../../types/types';
import  { AxiosResponse } from "axios";

jest.mock("axios");

describe("Testing authentication", () => {
    let axiosResponse : AxiosResponse;
    beforeAll(() => {

    })
    beforeEach(() => {
        axiosResponse = {
            data: {},
            status: 123, 
            statusText: "", 
            config: {},
            headers: {} 
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set authenticated to false when cookie is not present", () => {

        const spyGetCookie = jest.spyOn(CookieHandler.prototype, 'getCookie').mockImplementation(() => "")
        const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, 'setItem')
        login()

        expect(spyGetCookie).toBeCalledTimes(1)
        expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false")
    });

    it("should set authenticated to false if cookie is present but API call fails", async () => {

        const spyGetCookie = jest.spyOn(CookieHandler.prototype, 'getCookie').mockImplementation(() => "123456");
        const spyOnApiHandler =  jest.spyOn(accountsClient.prototype, 'getUserData').mockImplementation(() => Promise.resolve({"detail": "some fake detail"}));
        
        const spyDeleteCookie = jest.spyOn(CookieHandler.prototype, 'deleteCookie')
        const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, 'setItem').mockReset();

        login()
       
        expect(spyGetCookie).toBeCalledTimes(1);
        expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
        await spyOnApiHandler
        expect(spyLocalStorage).toHaveBeenCalledTimes(1)
        expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
        expect(spyDeleteCookie).toHaveBeenCalledWith("authToken");
        expect(spyDeleteCookie).toHaveBeenCalledTimes(1);
    });

    it("should set authenticated to true if cookie is present and API call works", async () => {
        let authToken: string = "123456"
        const cookiePayload: cookieDataType = {
            name: "authToken",
            value: authToken,
            duration: configuration["cookie-maxAuthDuration"],
            path: "/",
            secure: true
        };
        const spyGetCookie = jest.spyOn(CookieHandler.prototype, 'getCookie').mockImplementation(() => authToken);
        const spySetCookie = jest.spyOn(CookieHandler.prototype, 'setCookie')
        const spyOnApiHandler =  jest.spyOn(accountsClient.prototype, 'getUserData').mockImplementation(() => Promise.resolve(axiosResponse));
        const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, 'setItem').mockReset();

        login()
       
        expect(spyGetCookie).toBeCalledTimes(1);
        expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
        await spyOnApiHandler
        expect(spyLocalStorage).toHaveBeenCalledTimes(1)
        expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "true");
        expect(spySetCookie).toHaveBeenCalledWith(cookiePayload)
        expect(spySetCookie).toHaveBeenCalledTimes(1);
    });
})