import {login, logout} from "../authentication";
import CookieHandler from "../cookies";
import * as authenticationAPI from "../../api/authentication";
import configuration from "../../utils/config";

import type { cookieDataType } from "../../types/types";
import  { AxiosResponse } from "axios";

jest.mock("axios");
describe("Testing logout", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("removes local storage and cookies on logout", async () => {
		const data: AxiosResponse = {
			data: {},
			status: 204,
			statusText: "OK",
			headers: {},
			config: {}
		};
		const spyGetCookie = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "1234");
		const spyOnApiHandler = jest.spyOn(authenticationAPI, "postTokenLogout").mockImplementation(() => Promise.resolve(data));
		const spyDeleteCookie = jest.spyOn(CookieHandler.prototype, "deleteCookie");
		const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, "setItem");

		logout();

		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyDeleteCookie).toBeCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");

	});
});

describe("Testing login", () => {
	let axiosResponse : AxiosResponse;
	beforeEach(() => {
		axiosResponse = {
			data: {},
			status: 123, 
			statusText: "", 
			config: {},
			headers: {} 
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should set authenticated to false when cookie is not present", () => {

		const spyGetCookie = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "");
		const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, "setItem");
		login();

		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
	});

	it("should set authenticated to false if cookie is present but API call fails", async () => {

		axiosResponse.data = {"detail": "some fake detail"};
		const spyGetCookie = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "123456");
		const spyOnApiHandler =  jest.spyOn(authenticationAPI, "getIsActiveUser").mockImplementation(() => Promise.resolve(axiosResponse));
        
		const spyDeleteCookie = jest.spyOn(CookieHandler.prototype, "deleteCookie");
		const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, "setItem").mockReset();

		login();
       
		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyLocalStorage).toHaveBeenCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
		expect(spyDeleteCookie).toHaveBeenCalledWith("authToken");
		expect(spyDeleteCookie).toHaveBeenCalledTimes(1);
	});

	it("should set authenticated to true if cookie is present and API call works", async () => {
		const authToken = "123456";
		const cookiePayload: cookieDataType = {
			name: "authToken",
			value: authToken,
			duration: configuration["cookie-maxAuthDuration"],
			path: "/",
			secure: true
		};
		const spyGetCookie = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => authToken);
		const spySetCookie = jest.spyOn(CookieHandler.prototype, "setCookie");
		const spyOnApiHandler =  jest.spyOn(authenticationAPI, "getIsActiveUser").mockImplementation(() => Promise.resolve(axiosResponse));
		const spyLocalStorage = jest.spyOn(window.localStorage.__proto__, "setItem").mockReset();

		login();
       
		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyLocalStorage).toHaveBeenCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "true");
		expect(spySetCookie).toHaveBeenCalledWith(cookiePayload);
		expect(spySetCookie).toHaveBeenCalledTimes(1);
	});
});