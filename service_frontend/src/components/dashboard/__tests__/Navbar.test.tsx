import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Middleware, Dispatch, AnyAction } from "redux";
import configureStore from "redux-mock-store";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/store";
import viewsReducer, { toggleDashboardView } from "../../../store/slices/viewSlice";
import configuration from "../../../utils/config";
import * as AuthModules from "../../../modules/authentication";

import type { ViewsStateInterface } from "../../../types/store";

import Navbar from "../Navbar";

describe("Testing navbar from dashboard", () => {
	let state: any;
	store.dispatch = jest.fn();
	beforeEach(() => {
		state = {
			viewReducer: {
				stateStatus: "idle",
				dashboard: {
					settings: false,
					profile: false,
					appstore: true,
				}
			},
			siteConfiguration: {
				siteConfigReducer: {
					data: {
						clearLoginCache: false
					}
				}
			},
			userReducer: {
				stateStatus: "idle",
				data: {
					id: null,
					first_name: "",
					last_name: "",
					country: "",
					mobile_number: "",
					email: ""
				},
				error: {}
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

	it("Profile menu item profile changes state", async () => {
		const newState: ViewsStateInterface = state;
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
			fireEvent.click(profileMenuItems[1]);
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({payload: "profile", type: "views/toggleDashboardView"});
		expect(viewsReducer(state, toggleDashboardView("profile"))).toEqual(newState);
	});

	it("Profile menu item settings changes state", async () => {
		const newState: ViewsStateInterface = state;
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
			fireEvent.click(profileMenuItems[2]);
		});

		// expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({payload: "settings", type: "views/toggleDashboardView"});
		expect(viewsReducer(state, toggleDashboardView("settings"))).toEqual(newState);
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
			fireEvent.click(logout[4]);
		});

		expect(history.location.pathname).toBe(configuration["url-home"]);
	});

	it("Switch account hard does a hard logout and routes to login", async () => {
		const history = createMemoryHistory();
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");
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
			fireEvent.click(logout[3]);
		});
		
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});


});