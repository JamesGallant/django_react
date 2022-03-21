import React from "react";
import thunk from "redux-thunk";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Middleware, Dispatch, AnyAction } from "redux";
import configureStore from "redux-mock-store";

import AppStoreView from "../appStoreView";

import type { UserOwnedAppsPagedInterface } from "../../../../types/applicationTypes";

describe("Testing AppStore component", () => {
	const history = createMemoryHistory();
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [thunk];
	const mockStore = configureStore(middlewares);
	let state: any;

	beforeEach(() => {
		state={
			users: {
				userReducer: {
					stateStatus: "idle",
					data: {
						id: 1,
						first_name: "fname",
						last_name: "lname",
						country: "Netherlands",
						mobile_number: "+3100000",
						email: "test@user.com"
					},
					error: {}
				}
			},
			userOwnedApps: {
				userAppsReducer: {
					stateStatus: "idle",
					data: {
						count: 0,
						next: null,
						previous: null,
						results: undefined
					},
					error: {}
				}
			},
			registeredApps: {
				registeredAppsReducer: {
					stateStatus: "idle",
					data: {
						count: 1,
						next: null,
						previous: null,
						results: [
							{
								id: 1,
								name: "test app",
								card_description: "card description",
								full_description: "full description",
								demo_app_description: "d1|d2",
								basic_app_description: "b1|b2",
								premium_app_description: "p1|p2",
								basic_cost_currency: "EUR",
								premium_cost_currency: "EUR",
								basic_cost: 10.00,
								premium_cost: 20.00,
								subscription_type: "DEMO|BASIC|PREMIUM",
								url: "/",
								disabled: false
							}
						]
					},
					error: {}
				}
			},
			purchaseDialog: {
				purchaseDialogReducer: {
					data: {
						steps: ["Subscriptions", "configure plan", "payment options", "complete"],
						activeStep: 0,
						appID: 0,
						selectedSubscription: "UNDEFINED",
						cardSelection: {
							demo: false,
							basic: false,
							premium: false
						},
						configuration: {
							duration: 1,
							durationText: "1  month",
							multiplier: 1,
							discountInfo: "",
						}
					}
				}
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);
	});

	it("Should dispatch functions on load", () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();
		render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		expect(store.dispatch).toHaveBeenCalledTimes(2);
	});

	it("If loading status is pending app should display a spinner", () => {
		state.registeredApps.registeredAppsReducer.stateStatus = "pending";
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);
		
		expect(wrapper.getByRole("progressbar")).toBeInTheDocument();
	});

	it("Cards should be present in the dom when there are registered apps in state", () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		expect(wrapper.getByText("test app")).toBeInTheDocument();
		expect(wrapper.getByText("card description")).toBeInTheDocument();
	});

	it("Clicking about button should display modal with more info", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		const AboutBtn: HTMLElement = wrapper.getByRole("button", { name: "About" });
		await waitFor(() => {
			fireEvent.click(AboutBtn);
		});
		
		expect(wrapper.getByText("More about test app")).toBeInTheDocument();
		expect(wrapper.getByText("full description")).toBeInTheDocument();
	});

	it("If app is not owned it should be disabled", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		const actionAreaBtn: HTMLElement[] = wrapper.getAllByRole("button");

		expect(actionAreaBtn[0]).toHaveAttribute("disabled");
		expect(wrapper.getByText("Purchase")).toBeInTheDocument();
	});

	it("Owned app is clickable", () => {
		const date: Date = new Date();
		const newDate: Date = new Date(date.setMonth(date.getMonth() + 1));
		const ownedApp: UserOwnedAppsPagedInterface = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					id: 1,
					activation_date: date.toString(),
					expiration_date: newDate.toString(),
					app: 1,
					user: 1,
					is_expired: false
				}
			]
		};

		state.userOwnedApps.userAppsReducer.data = ownedApp;
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		const actionAreaBtn: HTMLElement[] = wrapper.getAllByRole("button");
		
		expect(actionAreaBtn[0]).not.toHaveAttribute("disabled");
		expect(wrapper.getByText("OWNED")).toBeInTheDocument();
	});

	it("Expiration date in the past should display purchase", () => {
		const date: Date = new Date();
		const newDate: Date = new Date(date.setMonth(date.getMonth() - 1));
		const ownedApp: UserOwnedAppsPagedInterface = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					id: 1,
					activation_date: date.toString(),
					expiration_date: newDate.toString(),
					app: 1,
					user: 1,
					is_expired: true
				}
			]
		};

		state.userOwnedApps.userAppsReducer.data = ownedApp;
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		const actionAreaBtn: HTMLElement[] = wrapper.getAllByRole("button");
		
		expect(actionAreaBtn[0]).toHaveAttribute("disabled");
		expect(wrapper.getByText("Purchase")).toBeInTheDocument();
	});

	it("Clicking on owned app should fire route change", async () => {
		const date: Date = new Date();
		const newDate: Date = new Date(date.setMonth(date.getMonth() + 1));
		const ownedApp: UserOwnedAppsPagedInterface = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					id: 1,
					activation_date: date.toString(),
					expiration_date: newDate.toString(),
					app: 1,
					user: 1,
					is_expired: false
				}
			]
		};

		state.userOwnedApps.userAppsReducer.data = ownedApp;
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<AppStoreView />
				</Router>
			</Provider>
		);

		const btns: HTMLElement[] = wrapper.getAllByRole("button");
		
		await waitFor(() => {
			fireEvent.click(btns[0]);
		});

		expect(history.location.pathname).toBe("/");
	});
	
});