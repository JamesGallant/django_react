import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import ReactRouter from "react-router";

import configuration from "../../../../utils/config";
import ResetUsernameConfirm from "../resetUsernameConfirmView";
import * as authentication from "../../../../modules/authentication";
import * as API from "../../../../api/authenticationAPI";

describe("Testing the ResetUsernameConfirmView", () => {
	let AxiosResponse: AxiosResponse;

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
		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		render(<ResetUsernameConfirm></ResetUsernameConfirm>);
	});

	it("Bad request (400) throws flashError when non_field_errors occur", async () => {
		AxiosResponse.data = {non_field_errors: ["random error"]};
		AxiosResponse.status = 400;

		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetUsernameConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(<ResetUsernameConfirm/>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("error")).toBeInTheDocument();
	});

	it("Bad request (400) throws flashError and logs out when token error occur", async () => {
		AxiosResponse.data = {token: ["token error"]};
		AxiosResponse.status = 400;

		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetUsernameConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));
		const spyOnLogout = jest.spyOn(authentication, "logout");

		const wrapper = render(<ResetUsernameConfirm/>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("Auth error detected, Account not reset")).toBeInTheDocument();
		expect(spyOnLogout).toHaveBeenCalledTimes(1);
	});

	it("Bad request (400) throws flashError when email error occur", async () => {
		AxiosResponse.data = {new_email: ["email error"]};
		AxiosResponse.status = 400;

		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetUsernameConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));

		const wrapper = render(<ResetUsernameConfirm/>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("email error")).toBeInTheDocument();
	});

	it("Auth error (401) throws flashError when authentication error occurs", async () => {
		AxiosResponse.data = {non_field_error: ["random error"]};
		AxiosResponse.status = 401;

		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetUsernameConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));
		const spyOnLogout = jest.spyOn(authentication, "logout");

		const wrapper = render(<ResetUsernameConfirm/>);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(wrapper.getByText("Auth error detected, Account not reset")).toBeInTheDocument();
		expect(spyOnLogout).toHaveBeenCalledTimes(1);
	});

	it("Successfull username redirects to login", async () => {
		AxiosResponse.status = 204;

		jest.spyOn(ReactRouter, "useParams").mockReturnValue({uid: "test", token: "123"});
		const spyOnApi: jest.SpyInstance = jest.spyOn(API, "resetUsernameConfirm").mockImplementation(() => Promise.resolve(AxiosResponse));
		const history = createMemoryHistory();

		const wrapper = render(
			<Router history={history}>
				<ResetUsernameConfirm/>
			</Router>
		);
		const submitButton: HTMLElement = wrapper.getByRole("button", {name: "Update email"});
		
		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnApi;
		expect(spyOnApi).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});
});

