import React from "react";
import {render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AxiosResponse } from "axios";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import * as API from "../../../../api/authenticationAPI";

import RegisterView from "../registerView";
import configuration from "../../../../utils/config";

jest.mock("axios");


describe("Testing account registration", () => {
	let axiosResponse: AxiosResponse;

	beforeEach(() => {
		axiosResponse = {
			data: {},
			status: 123, 
			statusText: "test", 
			config: {},
			headers: {}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("component renders correctly", () => {
		render(<RegisterView />);
	});

	it("displays no errors when form is completed correctly", async () => {
		const history = createMemoryHistory();
		axiosResponse.status = 201;
		axiosResponse.statusText = "OK";

		const spyOnRegister: jest.SpyInstance = jest.spyOn(API, "postRegisterUser").mockImplementation(() => Promise.resolve(axiosResponse));

		render(<Router history={history}>
			<RegisterView />
		</Router>);

		const submitButton =screen.getByRole("button", {name: "Register"});
		const fname = screen.getByRole("textbox", {name: "First Name"});
		const lname = screen.getByRole("textbox", {name: "Last Name"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});
		const country = screen.getByRole("textbox", {name: "Country"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnRegister;
		expect(spyOnRegister).toBeCalledTimes(1);
		expect(email).toHaveAttribute("aria-invalid", "false");
		expect(mobile).toHaveAttribute("aria-invalid", "false");
		expect(fname).toHaveAttribute("aria-invalid", "false");
		expect(lname).toHaveAttribute("aria-invalid", "false");
		expect(country).toHaveAttribute("aria-invalid", "false");
		expect(history.location.pathname).toBe(configuration["url-accountCreated"]);
	});

	it("displays errors on zero input", async () => {
		axiosResponse.data = {
			first_name: ["This field is required"],
			last_name: ["This field is required"],
			email: ["This field is required"],
			country: ["This field is required"],
			mobile_number: ["This field is required"],
			password: ["This field is required"],
		};
		axiosResponse.status = 400;
		axiosResponse.statusText = "Bad Request";

		const spyOnRegister: jest.SpyInstance = jest.spyOn(API, "postRegisterUser").mockImplementation(() => Promise.resolve(axiosResponse));
		
		render(<RegisterView />);

		const submitButton =screen.getByRole("button", {name: "Register"});
		const fname = screen.getByRole("textbox", {name: "First Name"});
		const lname = screen.getByRole("textbox", {name: "Last Name"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});
		const country = screen.getByRole("textbox", {name: "Country"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnRegister;
		expect(spyOnRegister).toBeCalledTimes(1);
		expect(screen.getAllByText("This field is required").length).toEqual(6);
		expect(screen.getAllByText("This field is required")[0]).toBeInTheDocument();
		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(mobile).toHaveAttribute("aria-invalid", "true");
		expect(fname).toHaveAttribute("aria-invalid", "true");
		expect(lname).toHaveAttribute("aria-invalid", "true");
		expect(country).toHaveAttribute("aria-invalid", "true");   
	});

	it("indicates that user with mobile and email exists", async () => {
		axiosResponse.data = {
			mobile_number: ["User with this mobile number already exists"],
			email: ["User with this email already exists"],
		};
		axiosResponse.status = 400;
		axiosResponse.statusText = "Bad Request";

		const spyOnRegister: jest.SpyInstance = jest.spyOn(API, "postRegisterUser").mockImplementation(() => Promise.resolve(axiosResponse));

		render(<RegisterView />);
		
		const submitButton = screen.getByRole("button", {name: "Register"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnRegister;
		expect(spyOnRegister).toBeCalledTimes(1);
		expect(screen.getByText("User with this mobile number already exists")).toBeInTheDocument();
		expect(screen.getByText("User with this email already exists")).toBeInTheDocument();
		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(mobile).toHaveAttribute("aria-invalid", "true");
        
	});

	it("Check that password errors display correctly", async () => {
		axiosResponse.data = {
			password: ["This password is too short.", 
				"It must contain at least 8 characters.", 
				"This password is too common.", 
				"This password is entirely numeric."],
		};
		axiosResponse.status = 400;
		axiosResponse.statusText = "Bad Request";

		const spyOnRegister: jest.SpyInstance = jest.spyOn(API, "postRegisterUser").mockImplementation(() => Promise.resolve(axiosResponse));

		render(<RegisterView />);

		const submitButton = screen.getByRole("button", {name: "Register"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnRegister;
		expect(spyOnRegister).toBeCalledTimes(1);
		expect(screen.getByText("This password is too short. It must contain at least 8 characters. This password is too common. This password is entirely numeric.")).toBeInTheDocument();
	});

	it("Displays flash errors when unauthorised", async () => {
		axiosResponse.status = 401;
		const spyOnRegister: jest.SpyInstance = jest.spyOn(API, "postRegisterUser").mockImplementation(() => Promise.resolve(axiosResponse));

		const wrapper = render(<RegisterView />);

		const submitButton = screen.getByRole("button", {name: "Register"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		await spyOnRegister;
		expect(spyOnRegister).toBeCalledTimes(1);
		expect(wrapper.getByText("Unauthorised token detected")).toBeInTheDocument();
	});
});