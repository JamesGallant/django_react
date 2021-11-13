import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import * as authHelpers from "../../../modules/authentication";
import configuration from "../../../utils/config";
import LogoutView from "../logoutView";

describe("Testing the dashboard view", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("mounts", () => {
		render(<LogoutView />);
	});

	it("logging out resets authentication in local storage and reroutes", async () => {
		const history = createMemoryHistory();

		const spyOnLogout: jest.SpyInstance = jest.spyOn(authHelpers, "logout");
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => "false");

		render(<Router history={history}>
			<LogoutView/>
		</Router>);

		expect(spyOnLogout).toBeCalledTimes(1);
		await spyOnLogout;
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated");
		expect(spyLocalStorage).toHaveReturnedWith("false");
		expect(history.location.pathname).toBe(configuration["url-home"]);

	});
});