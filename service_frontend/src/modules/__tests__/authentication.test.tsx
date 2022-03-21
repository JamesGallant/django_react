import { login, logout } from "../authentication";
import CookieHandler from "../cookies";
import * as authenticationAPI from "../../api/authenticationAPI";
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
		const spyGetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "1234");
		const spyOnApiHandler: jest.SpyInstance = jest.spyOn(authenticationAPI, "postTokenLogout").mockImplementation(() => Promise.resolve(data));
		const spyDeleteCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "deleteCookie");
		const spyLsSetItem: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "setItem");
		const spyLsRemoveItem: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "removeItem");

		logout();

		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyDeleteCookie).toBeCalledTimes(1);
		expect(spyLsSetItem).toHaveBeenCalledWith("authenticated", "false");
		expect(spyLsRemoveItem).toHaveBeenCalledWith(`persist:${configuration["persistKey-siteConfiguraton"]}`);
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

	it("should set authenticated to false when cookie is not present", async () => {

		const spyGetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "");
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "setItem");

		login();

		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
	});

	it("should set authenticated to false if cookie is present but API call fails", async () => {

		axiosResponse.data = { "detail": "some fake detail" };

		const spyGetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "123456");
		const spyOnApiHandler: jest.SpyInstance =  jest.spyOn(authenticationAPI, "getUserData").mockImplementation(() => Promise.resolve(axiosResponse));
		const spyDeleteCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "deleteCookie");
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "setItem").mockReset();

		login();
       
		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyLocalStorage).toHaveBeenCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
		expect(spyDeleteCookie).toHaveBeenCalledWith("authToken");
		expect(spyDeleteCookie).toHaveBeenCalledTimes(1);
	});

	it ("should delete a cookie if user is inactive", async () => {
		const authToken = "123456";
		axiosResponse.data = {
			message: {
				is_active: false
			}
		};

		const spyGetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => authToken);
		const spyDeleteCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "deleteCookie");
		const spyOnApiHandler: jest.SpyInstance =  jest.spyOn(authenticationAPI, "getUserData").mockImplementation(() => Promise.resolve(axiosResponse));
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "setItem").mockReset();

		login();
       
		expect(spyGetCookie).toBeCalledTimes(1);
		expect(spyOnApiHandler).toHaveBeenCalledTimes(1);
		await spyOnApiHandler;
		expect(spyLocalStorage).toBeCalledTimes(1);
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated", "false");
		expect(spyDeleteCookie).toBeCalledTimes(1);
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
		axiosResponse.data = {
			is_active: true,
			last_loigin: Date.now()
		};

		const spyGetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => authToken);
		const spySetCookie: jest.SpyInstance = jest.spyOn(CookieHandler.prototype, "setCookie");
		const spyOnApiHandler: jest.SpyInstance =  jest.spyOn(authenticationAPI, "getUserData").mockImplementation(() => Promise.resolve(axiosResponse));
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "setItem").mockReset();

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