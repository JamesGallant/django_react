import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/store";

import Profile from "../Profile";

describe("Testing Profile component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<Profile />
			</Provider>
		);
	});
});