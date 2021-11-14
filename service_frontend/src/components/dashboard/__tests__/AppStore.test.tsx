import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../../store/store";
import viewsReducer, { toggleDashboardView } from "../../../store/slices/viewSlice";
import { ViewsStateInterface } from "../../../types/store";

import AppStore from "../AppStore";

describe("Testing AppStore component", () => {
	let mockViewStore: ViewsStateInterface;
	beforeEach(() => {
		mockViewStore = {
			viewReducer: {
				stateStatus: "idle",
				dashboard: {
					settings: false,
					profile: false,
					appstore: true,
				}
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<AppStore />
			</Provider>
		);

		expect(viewsReducer(undefined, toggleDashboardView(""))).toEqual(mockViewStore);
	});
});