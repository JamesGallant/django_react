import React from "react";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { Middleware, Dispatch, AnyAction } from "redux";

import PurchaseDialog from "../purchaseDialog";

describe("Testing the PurchaseAppDialog", () => {
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
						results: undefined
					},
					error: {}
				}
			},
			purchaseDialog: {
				purchaseDialogReducer: {
					data: {
						steps: ["Subscriptions", "configure plan", "payment options", "complete"],
						activeStep: 0,
						appID: 1,
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
				<PurchaseDialog 
					isOpen={true} 
					onClose={() => null} 
					nextFn={() => Promise.resolve()}
					backFn={() => null} 
				/>
			</Provider>
		);
	});

	it("Next button should be disabled if subscription is undefined", async () => {
		const store = mockStore(state);

		const wrapper = render(
			<Provider store={store}>
				<PurchaseDialog 
					isOpen={true} 
					onClose={() => null} 
					nextFn={() => Promise.resolve()}
					backFn={() => null} 
				/>
			</Provider>
		);

		const nextBtn: HTMLElement = wrapper.getByRole("button", {name: "Next", hidden: true});
		expect(nextBtn).toHaveAttribute("disabled");
	});

	it("Next button should be active if subscription is chosen", async () => {
		state.purchaseDialog.purchaseDialogReducer.data = {
			...state.purchaseDialog.purchaseDialogReducer.data,
			selectedSubscription: "DEMO",
			cardSelection: {
				demo: true,
				basic: false,
				premium: false
			}
		};

		const store = mockStore(state);

		const wrapper = render(
			<Provider store={store}>
				<PurchaseDialog 
					isOpen={true} 
					onClose={() => null} 
					nextFn={() => Promise.resolve()}
					backFn={() => null} 
				/>
			</Provider>
		);

		const nextBtn: HTMLElement = wrapper.getByRole("button", {name: "Next", hidden: true});
		expect(nextBtn).not.toHaveAttribute("disabled");
	});

	it("Next button should display finish on last stepper", async () => {
		state.purchaseDialog.purchaseDialogReducer.data.activeStep = state.purchaseDialog.purchaseDialogReducer.data.steps.length - 1;
		const store = mockStore(state);

		const wrapper = render(
			<Provider store={store}>
				<PurchaseDialog 
					isOpen={true} 
					onClose={() => null} 
					nextFn={() => Promise.resolve()}
					backFn={() => null} 
				/>
			</Provider>
		);
		const nextBtn: HTMLElement = wrapper.getByRole("button", {name: "Finish", hidden: true});

		expect(nextBtn).toHaveTextContent("Finish");
	});
});