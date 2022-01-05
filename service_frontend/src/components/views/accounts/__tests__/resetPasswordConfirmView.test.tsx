import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";

import {Router} from "react-router-dom";

import configuration from "../../../../utils/config";
import ResetPasswordConfirm from "../resetPasswordConfirmView";
import * as authentication from "../../../../modules/authentication";
import * as API from "../../../../api/authenticationAPI";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: () => ({
		uid: "test",
		token: "123",
	})
}));
describe("Testing the resetPasswordConfirm view", () => {
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

	it("mounts", () => {
		render(
			<Router
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>
		);
	});

	it("Bad request throws flash error when token is invalid", async() => {
		AxiosResponse.data = {token: ["random error"]};
		AxiosResponse.status = 400;
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPasswordConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(			
			<Router
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("Invalid token, resend email")).toBeInTheDocument();
	});

	it("bad request response throws flash error when field errors are unknown", async() => {
		AxiosResponse.data = {non_field_errors: ["other error"]};
		AxiosResponse.status = 400;

		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPasswordConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(			
			<Router
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("other error")).toBeInTheDocument();
	});

	it("bad request response throws field errors correctly", async() => {
		AxiosResponse.data = {new_password: ["error password"], re_new_password: ["error new password"]};
		AxiosResponse.status = 400;
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPasswordConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(			
			<Router
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("error password")).toBeInTheDocument();
		expect(wrapper.getByText("error new password")).toBeInTheDocument();
	});

	it("Unauthorised user throws flash error and logs out", async() => {
		AxiosResponse.status = 401;
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPasswordConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const spyOnLogout = jest.spyOn(authentication, "logout");
		const wrapper = render(			
			<Router
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("Auth error detected, try logging in again")).toBeInTheDocument();
		expect(spyOnLogout).toHaveBeenCalledTimes(1);
	});

	it("Succcessfull password change redirects user to login", async() => {
		AxiosResponse.status = 204;
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetPasswordConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPasswordConfirm/>
			</Router>);

		const submitButton = wrapper.getByRole("button", {name: "Update Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});
		
		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});
});