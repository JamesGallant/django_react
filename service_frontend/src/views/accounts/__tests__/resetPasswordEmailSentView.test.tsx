import React from "react";
import { render } from "@testing-library/react";
import ResetPasswordEmailSent from "../resetPasswordEmailSentView";

import configuration from "../../../utils/config";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: () => ({
		pathname: "/auth/reset/password/email-sent",
		state: {
			email: "test@test.com"
		}
	})
}));
  
describe("Testing view after email has been sent to reset users password", () => {
	it("mounts", () => {
		render(<ResetPasswordEmailSent/>);
	});
});