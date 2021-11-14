import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../../store/store";

import AppStoreMain from "../AppStoreMain";

describe("Testing AppStore component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<AppStoreMain />
			</Provider>
		);
	});
});