import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import configureStore from "redux-mock-store";

import { Provider } from "react-redux";

import * as authHelpers from "../../../modules/authentication";
import configuration from "../../../utils/config";
import LogoutView from "../logoutView";
import { Middleware, Dispatch, AnyAction } from "redux";

describe("Testing the logout view", () => {
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [];
	const mockStore = configureStore(middlewares);
	let state: any;
	const history = createMemoryHistory();

	beforeEach(() => {
		state = {
			siteConfiguration: {
				siteConfigReducer: {
					data: {
						clearLoginCache: false
					}
				}
			}
		};

	});
	
	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("mounts", () => {
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<Router history={history}>
					<LogoutView/>
				</Router>
			</Provider>
		);
	});

	it("logout module called when clear cache is true", async () => {
		state.siteConfiguration.siteConfigReducer.data.clearLoginCache = true;
		const store = mockStore(state);
		const spyOnLogout: jest.SpyInstance = jest.spyOn(authHelpers, "logout");
		const spyLocalStorage: jest.SpyInstance = jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => "false");

		render(
			<Provider store={store}>
				<Router history={history}>
					<LogoutView/>
				</Router>
			</Provider>
		);

		expect(spyOnLogout).toBeCalledTimes(1);
		await spyOnLogout;
		expect(spyLocalStorage).toHaveBeenCalledWith("authenticated");
		expect(spyLocalStorage).toHaveReturnedWith("false");
		expect(history.location.pathname).toBe(configuration["url-home"]);

	});

	it("Reroutes home when clear cache is false", async () => {
		const store = mockStore(state);
		const spyOnLogout: jest.SpyInstance = jest.spyOn(authHelpers, "logout");
		render(
			<Provider store={store}>
				<Router history={history}>
					<LogoutView/>
				</Router>
			</Provider>
		);

		expect(spyOnLogout).toBeCalledTimes(0);
		await spyOnLogout;
		expect(history.location.pathname).toBe(configuration["url-home"]);

	});
});