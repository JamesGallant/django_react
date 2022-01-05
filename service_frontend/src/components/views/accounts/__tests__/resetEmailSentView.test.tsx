import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordEmailSent from "../resetEmailSentView";
import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import * as authenticationAPI from "../../../../api/authenticationAPI";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: () => ({
		pathname: "/auth/reset/password/email-sent",
		state: {
			email: "test@test.com",
			changed: "password"
		}
	})
}));

jest.mock("axios");

describe("Testing view after email has been sent to reset users password", () => {
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
		jest.clearAllMocks();
	});

	it("mounts", () => {
		render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPasswordEmailSent/>
			</Router>);
	});

	it("Resend email fires api call and alerts user of success", async () => {
		AxiosResponse.status = 204;

		const wrapper = render(			
			<Router 
				navigator={history}
				location={history.location}
			>
				<ResetPasswordEmailSent/>
			</Router>);
			
		const resendEmail: HTMLElement = wrapper.getByRole("button", {name: "Resend email"});
		const spyOnResetPassword: jest.SpyInstance = jest.spyOn(authenticationAPI, "resetPassword").mockImplementation(() => Promise.resolve(AxiosResponse));

		await waitFor(() => {
			fireEvent.click(resendEmail);
		});
		
		await spyOnResetPassword;
		expect(spyOnResetPassword).toHaveBeenCalledTimes(1);
		expect(wrapper.getByText("Email sent")).toBeInTheDocument();
	});
});