import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { Middleware, Dispatch, AnyAction } from "redux";

import SubscriptionStep from "../subscriptionStep";

describe("Testing the subscription step", () => {
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [];
	const mockStore = configureStore(middlewares);
	let state: any;

	beforeEach(() => {
		state = {
			registeredApps: {
				registeredAppsReducer: {
					stateStatus: "idle",
					data: {
						count: 0,
						next: null,
						previous: null,
						results: [
							{
								id: 1,
								name: "test app",
								card_description: "test description",
								full_description: "",
								demo_app_description: "item1",
								basic_app_description: "item1|item2",
								premium_app_description: "item1|item2|item3",
								basic_cost_currency: "EUR",
								premium_cost_currency: "EUR",
								basic_cost: 5.00,
								premium_cost: 10.00,
								subscription_type: "DEMO|BASIC|PREMIUM",
								url: "/",
								disabled: false
							},
							{
								id: 2,
								name: "test app 2",
								card_description: "test description",
								full_description: "",
								demo_app_description: "",
								basic_app_description: "item1|item2",
								premium_app_description: "",
								basic_cost_currency: "EUR",
								premium_cost_currency: "",
								basic_cost: 0.00,
								premium_cost: 0.00,
								subscription_type: "BASIC",
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
						selectedSubscription: "UNDEFINED",
						cardSelection: {
							demo: false,
							basic: false,
							premium: false
						}
					}
				}
			}
		};
	});

	it("Mounts", () => {
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<SubscriptionStep 
					appID={1}
				/>
			</Provider>
		);
	});

	it("should display cards based on description", () => {
		const store = mockStore(state);
		const wrapper = render(
			<Provider store={store}>
				<SubscriptionStep 
					appID={1}
				/>
			</Provider>
		);

		const demoCard = wrapper.getByText("DEMO");
		const basicCard = wrapper.getByText("BASIC");
		const premiumCard = wrapper.getByText("PREMIUM");
		expect(demoCard).toBeTruthy();
		expect(basicCard).toBeTruthy();
		expect(premiumCard).toBeTruthy();

	});

	it("if price is zero it should display free", () => {
		const store = mockStore(state);
		const wrapper = render(
			<Provider store={store}>
				<SubscriptionStep 
					appID={2}
				/>
			</Provider>
		);

		const cost: HTMLElement = wrapper.getByText("FREE");

		expect(cost).toBeTruthy();
	});

	it("should dispatch on selecting card", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<SubscriptionStep 
					appID={1}
				/>
			</Provider>
		);

		const selectPlanBtn: HTMLElement[] = wrapper.getAllByRole("button", { name: "Select plan" });

		await waitFor(() => {
			fireEvent.click(selectPlanBtn[0]);
		});
		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({ "payload": "DEMO", "type": "purchaseDialog/setSelectedSubscription" });
	});

});