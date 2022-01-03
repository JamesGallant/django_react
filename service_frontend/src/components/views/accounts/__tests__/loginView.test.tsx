import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import LoginView from "../loginView";
import CookieHandler from "../../../../modules/cookies";
import * as API from "../../../../api/authenticationAPI";
import configuration from "../../../../utils/config";

import {login} from "../../../../modules/authentication";

jest.mock("axios");
jest.mock("../../../../modules/authentication");

describe("Testing login", () => {
	let axiosResponse: AxiosResponse;
	beforeEach(() => {
		axiosResponse = {
			data: {},
			status: 123, 
			statusText: "test", 
			config: {},
			headers: {}
		};
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("component renders correctly", () => {
		render(
			<LoginView/>
		);
	});

	it("Error is displayed on invalid account", async () => {
		axiosResponse.data = {
			non_field_errors: ["Some error"]
		};
		axiosResponse.statusText = "Bad Request";
		axiosResponse.status = 400;

		const spyOnTokenLogin: jest.SpyInstance = jest.spyOn(API, "postTokenLogin").mockImplementation(() => Promise.resolve(axiosResponse));

		const wrapper = render(
			<LoginView/>
		);

		const submitButton = wrapper.getByRole("button", {name: "Log in"});
        
		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnTokenLogin;
		expect(spyOnTokenLogin).toBeCalledTimes(1);
		expect(await wrapper.findByText("Invalid username or password")).toBeInTheDocument();
	});

	it("displays field errors if input is invalid or missing", async () => {
		axiosResponse.data = {
			email: ["This field is required"],
			password: ["This field is required"]
		};
		axiosResponse.statusText = "Bad Request";
		axiosResponse.status = 400;

		const spyOnTokenLogin: jest.SpyInstance = jest.spyOn(API, "postTokenLogin").mockImplementation(() => Promise.resolve(axiosResponse));

		const wrapper = render(
			<LoginView/>
		);
        
		const email = wrapper.getByRole("textbox", {name: "email"});
		const submitButton = wrapper.getByRole("button", {name: "Log in"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnTokenLogin;
		expect(spyOnTokenLogin).toBeCalledTimes(1);
		expect(wrapper.getAllByText("This field is required")[0]).toBeInTheDocument();
		expect(wrapper.getAllByText("This field is required").length).toBe(2);
		expect(email).toHaveAttribute("aria-invalid", "true");
	});

	it("sets cookies and routes to dashboard on successfull login", async () => {
		const history = createMemoryHistory();
		const axiosToken:  AxiosResponse = axiosResponse;
		const axiosUser: AxiosResponse = axiosResponse;

		axiosToken.data = {
			auth_token: "123456789"
		};
		axiosToken.statusText = "Bad Request";
		axiosToken.status = 200;

		axiosUser.statusText = "Bad Request";
		axiosUser.status = 200;

		const spyOnTokenLogin: jest.SpyInstance = jest.spyOn(API, "postTokenLogin").mockImplementation(() => Promise.resolve(axiosToken));
		const spyOnUser: jest.SpyInstance = jest.spyOn(API, "getUserData").mockImplementation(() => Promise.resolve(axiosUser));
		jest.spyOn(CookieHandler.prototype, "setCookie");
		jest.spyOn(window.localStorage.__proto__, "setItem");

		render(
			<Router history={history}>
				<LoginView />
			</Router>);

		await waitFor(() => {
			fireEvent.click(screen.getByRole("button", {name: "Log in"}));
		});
        
		await spyOnTokenLogin;
		await spyOnUser;
		expect(spyOnTokenLogin).toBeCalledTimes(1);
		expect(spyOnUser).toBeCalledTimes(1);
		expect(spyOnUser).toBeCalledWith(axiosToken.data.auth_token);
		expect(CookieHandler.prototype.setCookie).toHaveBeenCalledTimes(1);
		expect(window.localStorage.setItem).toBeCalledWith("authenticated", "true");
		expect(history.location.pathname).toBe(configuration["url-dashboard"]);
	});

	it("redirects to dash if already authenticated", () => {
		const history = createMemoryHistory();
       
		render(
			<Router history={history}>
				<LoginView />
			</Router>);

		expect(login).toHaveBeenCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-dashboard"]);
	});
});