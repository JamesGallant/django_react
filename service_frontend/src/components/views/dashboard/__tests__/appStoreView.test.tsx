import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../../../store/store";

import AppStoreView from "../appStoreView";

describe("Testing AppStore component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<AppStoreView />
			</Provider>
		);
	});
});