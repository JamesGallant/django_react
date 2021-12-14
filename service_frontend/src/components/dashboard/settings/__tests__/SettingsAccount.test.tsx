import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";
import { AxiosResponse } from "axios";
import { Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory } from "history";

import * as Api from "../../../../api/authentication";
import * as AuthModules from "../../../../modules/authentication";

import configuration from "../../../../utils/config";
import SettingsAccount from "../SettingsAccount";

describe("Testing profile settings", () => {
	let AxiosResponse: AxiosResponse;
	let history: MemoryHistory;
	store.dispatch = jest.fn();
	beforeEach(() => {
		history = createMemoryHistory();

		AxiosResponse = {
			data: {},
			status: 123, 
			statusText: "", 
			config: {},
			headers: {}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	it("Mounts", () => {
		render(<Provider store={store}>
			<SettingsAccount />
		</Provider>);
	});

	it("Toggle login dispatches function to toggle clearLoginCache state", async () => {
		const wrapper = render(
			<Provider store={store}>
				<SettingsAccount />
			</Provider>);

		const checkbox: HTMLElement = wrapper.getByRole("checkbox");
		await waitFor(() => {
			fireEvent.click(checkbox);
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith({payload: undefined, type: "siteConfiguration/toggleClearLoginCache"});
	});
	
	it("Update email by unauthorised token logs user out and reroutes to login", async () => {
		AxiosResponse.status = 401;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "resetUsername").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Update email"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Change your email address?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});

	it("Successfull update email request logs user out and reroutes to emailSentView", async () => {
		AxiosResponse.status = 204;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "resetUsername").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Update email"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Change your email address?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-resetEmailSent"]);
	});

	it("Update password by unauthorised token logs user out and reroutes to login", async () => {
		AxiosResponse.status = 401;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "resetPassword").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Update password"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Update your password?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});

	it("Successfull password update request logs user out and reroutes to emailSentView", async () => {
		AxiosResponse.status = 204;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "resetPassword").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Update password"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Update your password?")).toBeInTheDocument();
		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-resetEmailSent"]);
	});

	it("Wrong password given for delete user account gives field error", async () => {
		AxiosResponse.status = 400;
		AxiosResponse.data = {
			current_password: ["Invalid password"]
		};

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "deleteUser").mockImplementationOnce(() => Promise.resolve(AxiosResponse));

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Delete account"});

		
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Delete your account?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(wrapper.getByText("Invalid password")).toBeInTheDocument();
	});

	it("Unauthorised delete user logs user out and redirects to login", async () => {
		AxiosResponse.status = 401;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "deleteUser").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Delete account"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Delete your account?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-login"]);
	});

	it("Successfull delete account logs user out and redirects home", async () => {
		AxiosResponse.status = 204;

		const spyOnApi: jest.SpyInstance = jest.spyOn(Api, "deleteUser").mockImplementationOnce(() => Promise.resolve(AxiosResponse));
		const spyOnLogout: jest.SpyInstance = jest.spyOn(AuthModules, "logout");

		const wrapper = render(
			<Provider store={store}>
				<Router history={history}>
					<SettingsAccount/>
				</Router>
			</Provider>);

		const button: HTMLElement = wrapper.getByRole("button", {name: "Delete account"});
		await waitFor(() => {
			fireEvent.click(button);
		});

		const modalButton: HTMLElement = wrapper.getByRole("button", { name: "Ok", hidden: true});
		expect(wrapper.getByText("Delete your account?")).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.click(modalButton);
		});

		await spyOnApi;
		expect(spyOnLogout).toBeCalledTimes(1);
		expect(history.location.pathname).toBe(configuration["url-home"]);
	});
});