import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import configuration from "../../../utils/config";

import Navbar from "../Navbar";

describe("Testing navbar from dashboard", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Should mount", () => {
		render(<Navbar />);
	});

	it("Profile item logout functions properly", async () => {
		const history = createMemoryHistory();

		const wrapper = render(<Router history={history}>
			<Navbar/>
		</Router>);

		const ProfileButton: HTMLElement = wrapper.getByRole("button", {name: "userAccount"});

		await waitFor(() => {
			fireEvent.click(ProfileButton);
		});

		const logout: HTMLElement[] = wrapper.getAllByRole("menuitem");

		await waitFor(() => {
			fireEvent.click(logout[2]);
		});

		expect(history.location.pathname).toBe(configuration["url-logout"]);
	});
});