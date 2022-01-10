import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { store } from "../../../../store/store";

import AppStoreView from "../appStoreView";

describe("Testing AppStore component", () => {
	const history = createMemoryHistory();
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
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
});