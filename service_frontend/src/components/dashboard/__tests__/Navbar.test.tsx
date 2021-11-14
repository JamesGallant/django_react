import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/store";
import viewsReducer, { toggleDashboardView } from "../../../store/slices/viewSlice";
import type { ViewsStateInterface } from "../../../types/store";

import configuration from "../../../utils/config";

import Navbar from "../Navbar";

describe("Testing navbar from dashboard", () => {
	let mockViewStore: ViewsStateInterface;
	store.dispatch = jest.fn();
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
		jest.resetAllMocks();
	});

	it("Should mount", () => {
		render(
			<Provider store={store}>
				<Navbar />
			</Provider>);
	});

	it("Profile item logout functions properly", async () => {
		const history = createMemoryHistory();

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<Navbar/>
				</Router>
			</Provider>);

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

	it("Profile menu item profile changes state", async () => {
		const newState: ViewsStateInterface = mockViewStore;
		newState.viewReducer.dashboard.profile = true;
		newState.viewReducer.dashboard.appstore = false;

		const wrapper = render(
			<Provider store={store}>
				<Navbar/>
			</Provider>);

		const ProfileButton: HTMLElement = wrapper.getByRole("button", {name: "userAccount"});
		await waitFor(() => {
			fireEvent.click(ProfileButton);
		});

		const profileMenuItems: HTMLElement[] = wrapper.getAllByRole("menuitem");
		await waitFor(() => {
			fireEvent.click(profileMenuItems[0]);
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({payload: "profile", type: "views/toggleDashboardView"});
		expect(viewsReducer(mockViewStore, toggleDashboardView("profile"))).toEqual(newState);
	});

	it("Profile menu item settings changes state", async () => {
		const newState: ViewsStateInterface = mockViewStore;
		newState.viewReducer.dashboard.settings = true;
		newState.viewReducer.dashboard.appstore = false;
		newState.viewReducer.dashboard.profile = false;

		const wrapper = render(
			<Provider store={store}>
				<Navbar/>
			</Provider>);

		const ProfileButton: HTMLElement = wrapper.getByRole("button", {name: "userAccount"});
		await waitFor(() => {
			fireEvent.click(ProfileButton);
		});

		const profileMenuItems: HTMLElement[] = wrapper.getAllByRole("menuitem");
		await waitFor(() => {
			fireEvent.click(profileMenuItems[1]);
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({payload: "settings", type: "views/toggleDashboardView"});
		expect(viewsReducer(mockViewStore, toggleDashboardView("settings"))).toEqual(newState);
	});
});