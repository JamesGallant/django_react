import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Middleware, Dispatch, AnyAction } from "redux";

import SettingsAppearance from "../settingsAppearance";

describe("Testing profile settings", () => {
	const middlewares: Middleware<unknown, any, Dispatch<AnyAction>>[] | undefined = [];
	const mockStore = configureStore(middlewares);
	let state: any;

	beforeEach(() => {
		state = {
			siteConfiguration: {
				siteConfigReducer: {
					data: {
						clearLoginCache: false,
						themePreference: {
							setting: "syncTheme",
							mode: "light",
						}
					}
				}
			}
		};
	});

	it("Mounts", () => {
		const store = mockStore(state);
		render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
	});

	it("Toggle theming to select dispatches select preference", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
		
		const toggleButton: HTMLElement = wrapper.getByRole("radio", {name: "Select"});

		await waitFor(() => {
			fireEvent.click(toggleButton);
		});
		
		expect(store.dispatch).toHaveBeenCalledWith({"payload": "SelectTheme", "type": "siteConfiguration/setThemePreference"});

	});

	it("Toggle theming to sync dispatches a system theme", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
		
		const toggleButton: HTMLElement = wrapper.getByRole("radio", {name: "Sync"});
		
		await waitFor(() => {
			fireEvent.click(toggleButton);
		});
		
		expect(store.dispatch).toHaveBeenCalledTimes(2);

	});

	it("Checking lightmode checkbox dispatches light theme", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
		
		const toggleButton = wrapper.getAllByRole("checkbox", {name: "thememode"});
		
		await waitFor(() => {
			fireEvent.click(toggleButton[0]);
		});

		expect(store.dispatch).toHaveBeenCalledWith({"payload": "light", "type": "siteConfiguration/setThemeMode"});

	});

	it("Checking darkmode checkbox dispatches new theme", async () => {
		const store = mockStore(state);
		store.dispatch = jest.fn();

		const wrapper = render(
			<Provider store={store}>
				<SettingsAppearance />
			</Provider>
		);
		
		const toggleButton = wrapper.getAllByRole("checkbox", {name: "thememode"});
		
		await waitFor(() => {
			fireEvent.click(toggleButton[1]);
		});

		expect(store.dispatch).toHaveBeenCalledWith({"payload": "dark", "type": "siteConfiguration/setThemeMode"});
	});

});