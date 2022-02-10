import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/store";
import configuration from "../../../utils/config";
import * as AuthModules from "../../../modules/authentication";


import Navbar from "../Navbar";

describe("Testing navbar from dashboard", () => {
	store.dispatch = jest.fn();
	const history = createMemoryHistory();

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Should mount", () => {
		const history = createMemoryHistory();
		render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<Navbar/>
				</Router>
			</Provider>);
	});

	it("Profile link in navbar profile menu navigates to profile route", async () => {
		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<Navbar/>
				</Router>
			</Provider>);

		const ProfileButton: HTMLElement = wrapper.getByRole("button", {name: "userAccount"});
		await waitFor(() => {
			fireEvent.click(ProfileButton);
		});

		const profileMenuItems: HTMLElement[] = wrapper.getAllByRole("menuitem");
		await waitFor(() => {
			fireEvent.click(profileMenuItems[1]);
		});

		expect(history.location.pathname).toBe(`/${configuration["url-dashboard-profile"]}`);
	});

	it("Settings link in navbar profile menu navigates to settings route", async () => {
		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<Navbar/>
				</Router>
			</Provider>);

		const ProfileButton: HTMLElement = wrapper.getByRole("button", {name: "userAccount"});
		await waitFor(() => {
			fireEvent.click(ProfileButton);
		});

		const profileMenuItems: HTMLElement[] = wrapper.getAllByRole("menuitem");
		await waitFor(() => {
			fireEvent.click(profileMenuItems[2]);
		});

		expect(history.location.pathname).toBe(`/${configuration["url-dashboard-settings"]}`);
	});

	it("Navbar main icon redirects home", async () => {
		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
					<Navbar/>
				</Router>
			</Provider>);

		const homeButton: HTMLElement = wrapper.getByRole("button", {name: "dash-home"});
		await waitFor(() => {
			fireEvent.click(homeButton);
		});

		expect(history.location.pathname).toBe(`/${configuration["url-dashboard-home"]}`);
	});

	it("Profile item logout functions properly", async () => {
		const history = createMemoryHistory();

		const wrapper = render(
			<Provider store={store}>
				<Router 
					navigator={history}
					location={history.location}
				>
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
				<Router 
					navigator={history}
					location={history.location}
				>
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