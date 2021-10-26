import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordEmailSent from "../resetPasswordEmailSentView";
import { mocked } from "ts-jest/dist/utils/testing";
import axios, { AxiosResponse } from "axios";

import * as authenticationAPI from "../../../api/authentication";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: () => ({
		pathname: "/auth/reset/password/email-sent",
		state: {
			email: "test@test.com"
		}
	})
}));

jest.mock("axios");

describe("Testing view after email has been sent to reset users password", () => {
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
		jest.clearAllMocks();
	});

	it("mounts", () => {
		render(<ResetPasswordEmailSent/>);
	});

	it("Resend email fires api call and alerts user of success", async () => {
		AxiosResponse.status = 204;

		const wrapper = render(<ResetPasswordEmailSent/>);
		const resendEmail = wrapper.getByRole("button", {name: "Resend email"});
		const spyOnResetPassword = jest.spyOn(authenticationAPI, "resetPassword");
		mocked(axios).mockResolvedValue(AxiosResponse);
		await waitFor(() => {
			fireEvent.click(resendEmail);
		});

		expect(spyOnResetPassword).toHaveBeenCalledTimes(1);
		expect(wrapper.getByText("Email sent")).toBeInTheDocument();
	});
});