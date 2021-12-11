import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Middleware, Dispatch, AnyAction } from "redux";
import App from "../App";

/**
 * @author James Gallant
 * 
 * @description Testing app component, it is where the router lives and should do nothing more than load. Child components will be 
 * indvidually tested
 **/

describe("Testing the main component", () => {
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [];
	const mockStore = configureStore(middlewares);
	let state: any;

	beforeEach(() => {
		state = {
			siteConfiguration: {
				siteConfigReducer: {
					data: {
						clearLoginCache: false,
						themePreference: {
							setting: "syncTheme",
							mode: "light",
						}
					}
				}
			}
		};
	});

	it("App component renders", () => {
		const history = createMemoryHistory();
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<Router history={history}>
					<App />
				</Router>
			</Provider>
		);
	});

	it("Sets theme preference based on system setting when sync", () => {
		const history = createMemoryHistory();
		const store = mockStore(state);
		store.dispatch = jest.fn();
		render(
			<Provider store={store}>
				<Router history={history}>
					<App />
				</Router>
			</Provider>
		);

		expect(store.dispatch).toHaveBeenCalledWith({"payload": "light", "type": "siteConfiguration/setThemeMode"});
	});
});

