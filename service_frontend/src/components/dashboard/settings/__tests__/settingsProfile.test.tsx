import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced }  from "redux-mock-store";
import thunk from "redux-thunk";

import CookieHandler from "../../../../modules/cookies";
import * as API from "../../../../api/authenticationAPI";
import * as reduxHooks from "../../../../store/hooks";
import * as userFunctions from "../../../../store/slices/userSlice";

import SettingsProfile from "../settingsProfile";

import type { AxiosResponse } from "axios";

const middlewares: Array<any> = [thunk];
const mockStore = configureStore (middlewares);


describe("Testing profile settings", () => {
	let axiosResponse: AxiosResponse;
	let mockState;
	let store: MockStoreEnhanced<any, any>;

	beforeEach(() => {
		axiosResponse = {
			data: {},
			status: 123, 
			statusText: "test", 
			config: {},
			headers: {}
		};

		mockState = {
			users: {
				userReducer: {
					stateStatus: "idle",
					data: {
						id: 0,
						first_name: "testFirstName",
						last_name: "testLastName",
						country: "testCountry",
						mobile_number: "+31999999999"
					}
				}
			}
		};

		store = mockStore(mockState);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<SettingsProfile />
			</Provider>
		);
	});

	it("shows flash error on failed patch", async () => {
		axiosResponse.data.detail = "Unauthorised token detected";
		axiosResponse.status = 401;
		const spyOnCookies: jest.SpyInstance<string> = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "validToken");
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "patchUser").mockImplementation(() => Promise.resolve(axiosResponse));
		
		const wrapper = render(
			<Provider store={store}>
				<SettingsProfile />
			</Provider>
		);
		
		const submitButton = wrapper.getByRole("button", { name: "Update" });
		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		expect(spyOnCookies).toHaveBeenCalledTimes(1);
		expect(spyOnApi).toBeCalledTimes(1);
		await spyOnApi;
		expect(wrapper.getByText("Unauthorised token detected")).toBeInTheDocument();
	});

	it("updates state on successfull patch request", async () => {
		axiosResponse.status = 200;
		const spyOnCookies: jest.SpyInstance<string> = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "validToken");
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "patchUser").mockImplementation(() => Promise.resolve(axiosResponse));
		const spyOnDispatch: jest.SpyInstance = jest.spyOn(reduxHooks, "useAppDispatch");
		const spyOnUserState = jest.spyOn(userFunctions, "getUser");

		const wrapper = render(
			<Provider store={store}>
				<SettingsProfile />
			</Provider>
		);
		
		const submitButton = wrapper.getByRole("button", { name: "Update" });
		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		expect(spyOnCookies).toHaveBeenCalledTimes(1);
		expect(spyOnApi).toBeCalledTimes(1);
		await spyOnApi;
		expect(spyOnDispatch).toBeCalledTimes(2);
		expect(spyOnUserState).toBeCalledTimes(1);
	});

	it("Field errors are shown on 400", async () => {
		axiosResponse.data.first_name = ["Some error"];
		axiosResponse.status = 400;
		const spyOnCookies: jest.SpyInstance<string> = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "validToken");
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "patchUser").mockImplementation(() => Promise.resolve(axiosResponse));
		
		const wrapper = render(
			<Provider store={store}>
				<SettingsProfile />
			</Provider>
		);
		
		const submitButton = wrapper.getByRole("button", { name: "Update" });
		await waitFor(() => {
			fireEvent.click(submitButton);
		});
		const first_name_field = wrapper.getByRole("textbox", { name: "First name" });

		expect(spyOnCookies).toHaveBeenCalledTimes(1);
		expect(spyOnApi).toBeCalledTimes(1);
		await spyOnApi;
		expect(first_name_field).toHaveAttribute("aria-invalid", "true");
	});
});