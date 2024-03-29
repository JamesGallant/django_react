
import React from "react";
// import { render } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";

import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import DashboardView from "../dashboardView";
import CookieHandler from "../../../../modules/cookies";
import configuration from "../../../../utils/config";
import * as authenticationModules from "../../../../modules/authentication";

describe("Testing the dashboard view", () => {
	const history = createMemoryHistory();
	afterEach(() => {
		jest.resetAllMocks();
	});
	
	it("Mounts correctly", () => {
		render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<DashboardView />
				</Router>
			</Provider>
		);
	});

	it("Missing token redirects user to login", () => {
		const spyOnCookies: jest.SpyInstance<string> = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "");
		const spyOnLogout: jest.SpyInstance<Promise<void>> = jest.spyOn(authenticationModules, "logout");

		render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<DashboardView />
				</Router>
			</Provider>);
		
		expect(spyOnCookies).toBeCalledWith("authToken");
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});

	// need to mock the return of spyOnDispatch for this test to work, test that failed user login logs user out.
	// it("Token dispatches failed login thunk", () => {
	// 	const res = {
	// 		meta: {
	// 			requestStatus: "failed"
	// 		}
	// 	};
	// 	const spyOnCookies: jest.SpyInstance<string> = jest.spyOn(CookieHandler.prototype, "getCookie").mockImplementation(() => "validToken");
	// 	const spyOnDispatch: jest.SpyInstance = jest.spyOn(reduxHooks, "useAppDispatch").mockResolvedValueOnce(() => res);
	// 	const spyOnUserState = jest.spyOn(userFunctions, "getUser");

	// 	render(
	// 		<Provider store={store}>
	// 			<Router 
	// 				navigator={history}
	// 				location={history.location}
	// 			>
	// 				<DashboardView />
	// 			</Router>
	// 		</Provider>);
		
	// 	expect(spyOnCookies).toBeCalledWith("authToken");
	// 	expect(spyOnDispatch).toBeCalledTimes(3);
	// 	expect(spyOnUserState).toBeCalledTimes(1);
	// });
});