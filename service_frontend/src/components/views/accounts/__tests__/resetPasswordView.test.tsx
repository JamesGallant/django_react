import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import configuration from "../../../../utils/config";
import ResetPassword from "../resetPasswordView";
import * as authentication from "../../../../modules/authentication";
import * as API from "../../../../api/authenticationAPI";

jest.mock("axios");

describe("Testing reset password component", () => {
	let AxiosResponse: AxiosResponse;
	const history = createMemoryHistory();
	beforeEach(() => {
		AxiosResponse = {
			data: {},
			status: 123, 
			statusText: "", 
			config: {},
			headers: {}
		};
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("renders correctly", () => {
		render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPassword />		
			</Router>);
	});

	it("Response no email address error", async () => {
		const message = "This field is required";
		AxiosResponse.data = {email: [message]};
		AxiosResponse.status = 400;
		
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPassword").mockImplementation(() => Promise.resolve(AxiosResponse));
		const wrapper = render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPassword />		
			</Router>);

		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});
		const email = wrapper.getByRole("textbox", {name: "email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(wrapper.getAllByText(message)[0]).toBeInTheDocument();
	});

	it("Response when wrong email is entered", async () => {
		const message = "User with Given email does not exist";
		AxiosResponse.data = [message];
		AxiosResponse.status = 400;

		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPassword").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPassword />		
			</Router>);

		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});
		const email = wrapper.getByRole("textbox", {name: "email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});
		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(wrapper.getAllByText(message)[0]).toBeInTheDocument();
	});

	it("Mangled headers returns user to login screen", async () => {
		AxiosResponse.status = 401;
		const spyOnLogout: jest.SpyInstance = jest.spyOn(authentication, "logout");
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPassword").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPassword />		
			</Router>);

		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(spyOnLogout).toHaveBeenCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});

	it("Successfull reset request reroutes user", async () => {
		AxiosResponse.status = 204;

		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPassword").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPassword />		
			</Router>);

		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-resetEmailSent"]);
	});

});