import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/store";

import SettingsAppearance from "../SettingsAppearance";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
	});

});