import React from "react";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { Middleware, Dispatch, AnyAction } from "redux";

import ConfigureStep from "../configureStep";

describe("Testing configureStep component", () => {
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [];
	const mockStore = configureStore(middlewares);
	let state: any;

	beforeEach(() => {
		state={
			registeredApps: {
				registeredAppsReducer: {
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
			purchaseDialog: {
				purchaseDialogReducer: {
					steps: ["Subscriptions", "configure plan", "payment options", "complete"],
					activeStep: 0,
					appID: 1,
					data: {
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

	it("Should mount", () => {
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<ConfigureStep 
					appID={1}
				/>
			</Provider>
		);
	});

	it("DEMO subscriptions should be free", () => {
		state.registeredApps.registeredAppsReducer.data.results = [{
			id: 1,
			name: "test app",
			card_description: "",
			full_description: "",
			demo_app_description: "",
			basic_app_description: "",
			premium_app_description: "",
			basic_cost_currency: "EUR",
			basic_cost: 30,
			premium_cost_currency: "EUR",
			premium_cost: 60,
			url: "/",
			disabled: false
		}];

		state.purchaseDialog.purchaseDialogReducer.data.selectedSubscription = "DEMO";
		state.purchaseDialog.purchaseDialogReducer.data.cardSelection.demo = true;

		const store = mockStore(state);
		const wrapper = render(
			<Provider store={store}>
				<ConfigureStep 
					appID={1}
				/>
			</Provider>
		);

		expect(wrapper.getByText("FREE")).toBeInTheDocument();
	});

	it("Should render the base cost when duration is not set", () => {
		state.registeredApps.registeredAppsReducer.data.results = [{
			id: 1,
			name: "test app",
			card_description: "",
			full_description: "",
			demo_app_description: "",
			basic_app_description: "",
			premium_app_description: "",
			basic_cost_currency: "EUR",
			basic_cost: 30,
			premium_cost_currency: "EUR",
			premium_cost: 60,
			url: "/",
			disabled: false
		}];

		state.purchaseDialog.purchaseDialogReducer.data.selectedSubscription = "BASIC";
		state.purchaseDialog.purchaseDialogReducer.data.cardSelection.basic = true;
		const store = mockStore(state);
		const wrapper = render(
			<Provider store={store}>
				<ConfigureStep 
					appID={1}
				/>
			</Provider>
		);

		expect(wrapper.getByText("EUR 30.00")).toBeInTheDocument();
	});

	it("The correct ammount should render based on a multiplier when duration is changed", async () => {
		state.registeredApps.registeredAppsReducer.data.results = [{
			id: 1,
			name: "test app",
			card_description: "",
			full_description: "",
			demo_app_description: "",
			basic_app_description: "",
			premium_app_description: "",
			basic_cost_currency: "EUR",
			basic_cost: 30,
			premium_cost_currency: "EUR",
			premium_cost: 60,
			url: "/",
			disabled: false
		}];

		state.purchaseDialog.purchaseDialogReducer.data = {
			selectedSubscription: "BASIC",
			cardSelection: {
				demo: false,
				basic: true,
				premium: false
			},
			configuration: {
				duration: 6,
				durationText: "6  month",
				multiplier: 5,
				discountInfo: "One month Free",
			}
		};

		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<ConfigureStep 
					appID={1}
				/>
			</Provider>
		);

		expect(wrapper.getByText("EUR 150.00")).toBeInTheDocument();
		expect(wrapper.getByText("One month Free")).toBeInTheDocument();
	});
});