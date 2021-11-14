import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/store";

import ProfileMain from "../ProfileMain";

describe("Testing Profile component", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Mounts", () => {
		render(
			<Provider store={store}>
				<ProfileMain />
			</Provider>
		);
	});
});