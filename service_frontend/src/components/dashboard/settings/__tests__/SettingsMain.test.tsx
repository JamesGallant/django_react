import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";

import SettingsMain from "../SettingsMain";

describe("Testing the main settings tabbing component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	it("Mounts", () => {
		render(
			<Provider store={store}>
				<SettingsMain/>
			</Provider>
		);
	});
});