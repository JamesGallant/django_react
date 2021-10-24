import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { mocked } from "ts-jest/dist/utils/testing";

import configuration from "../../../utils/config";
import ResetPassword from "../resetPasswordView";

jest.mock("axios");

describe("Testing reset password component", () => {
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

	it("renders correctly", () => {
		render(<ResetPassword/>);
	});

	it("Response no email address error", async () => {
		const message = "This field is required";
		AxiosResponse.data = {email: [message]};
		AxiosResponse.status = 400;
		
		const wrapper = render(<ResetPassword/>);

		mocked(axios).mockResolvedValue(AxiosResponse);
		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});
		const email = wrapper.getByRole("textbox", {name: "email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(wrapper.getAllByText(message)[0]).toBeInTheDocument();
	});

	it("Response when wrong email is entered", async () => {
		const message = "User with Given email does not exist";
		AxiosResponse.data = [message];
		AxiosResponse.status = 400;
		
		const wrapper = render(<ResetPassword/>);

		mocked(axios).mockResolvedValue(AxiosResponse);
		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});
		const email = wrapper.getByRole("textbox", {name: "email"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(wrapper.getAllByText(message)[0]).toBeInTheDocument();
	});

	it("Correct email returns user to login screen", async () => {
		AxiosResponse.status = 204;
		const history = createMemoryHistory();
		
		const wrapper = render(<Router history={history}>
			<ResetPassword />		
		</Router>);

		mocked(axios).mockResolvedValue(AxiosResponse);
		const submitButton = wrapper.getByRole("button", {name: "Reset Password"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});


});