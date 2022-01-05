import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";

import SettingsView from "../settingsView";

describe("Testing the main settings tabbing component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	it("Mounts", () => {
		render(
			<Provider store={store}>
				<SettingsView/>
			</Provider>
		);
	});
});