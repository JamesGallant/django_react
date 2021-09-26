import React from "react";
import {render, screen, fireEvent, waitFor } from "@testing-library/react";

import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import RegisterView from "../registerView";
import configuration from "../../../utils/config";

jest.mock("axios");


describe("Testing account registration", () => {
    
	/**
     * @Description Tests the functionality of the account registration component following endpoints 
     * from https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-create
     */

	it("component renders correctly", () => {
		render(<RegisterView />);
	});

	it("displays no errors when form is completed correctly", async () => {
		const history = createMemoryHistory();

		const axiosResponse: AxiosResponse = {
			data: {},
			status: 201, 
			statusText: "Ok", 
			config: {},
			headers: {}
		};
		render(<Router history={history}>
			<RegisterView />
		</Router>);
                
		mocked(axios).mockResolvedValue(axiosResponse);

		const submitButton =screen.getByRole("button", {name: "Sign Up"});
		const fname = screen.getByRole("textbox", {name: "First Name"});
		const lname = screen.getByRole("textbox", {name: "Last Name"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});
		const country = screen.getByRole("textbox", {name: "Country"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});
        
		expect(email).toHaveAttribute("aria-invalid", "false");
		expect(mobile).toHaveAttribute("aria-invalid", "false");
		expect(fname).toHaveAttribute("aria-invalid", "false");
		expect(lname).toHaveAttribute("aria-invalid", "false");
		expect(country).toHaveAttribute("aria-invalid", "false");
		expect(history.location.pathname).toBe(configuration["url-accountCreated"]);
	});

	it("displays errors on zero input", async () => {

		const axiosResponse: AxiosResponse = {
			data: {
				first_name: ["This field is required"],
				last_name: ["This field is required"],
				email: ["This field is required"],
				country: ["This field is required"],
				mobile_number: ["This field is required"],
				password: ["This field is required"],
			},
			status: 400, 
			statusText: "BAD Request", 
			config: {},
			headers: {}
		};

		render(<RegisterView />);

		mocked(axios).mockResolvedValue(axiosResponse);
    
		const submitButton =screen.getByRole("button", {name: "Sign Up"});
		const fname = screen.getByRole("textbox", {name: "First Name"});
		const lname = screen.getByRole("textbox", {name: "Last Name"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});
		const country = screen.getByRole("textbox", {name: "Country"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		expect(screen.getAllByText("This field is required").length).toEqual(6);
		expect(screen.getAllByText("This field is required")[0]).toBeInTheDocument();

		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(mobile).toHaveAttribute("aria-invalid", "true");
		expect(fname).toHaveAttribute("aria-invalid", "true");
		expect(lname).toHaveAttribute("aria-invalid", "true");
		expect(country).toHaveAttribute("aria-invalid", "true");
        
        
	});
	it("indicates that user with mobile and email exists", async () => {
		const axiosResponse: AxiosResponse = {
			data: {
				mobile_number: ["User with this mobile number already exists"],
				email: ["User with this email already exists"],
			},
			status: 400, 
			statusText: "BAD Request", 
			config: {},
			headers: {}
		};

		render(<RegisterView />);

		mocked(axios).mockResolvedValue(axiosResponse);

		const submitButton = screen.getByRole("button", {name: "Sign Up"});
		const email = screen.getByRole("textbox", {name: "Email"});
		const mobile = screen.getByRole("textbox", {name: "mobile number"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});

		//screen.debug(undefined, Infinity)
		expect(screen.getByText("User with this mobile number already exists")).toBeInTheDocument();
		expect(screen.getByText("User with this email already exists")).toBeInTheDocument();
		expect(email).toHaveAttribute("aria-invalid", "true");
		expect(mobile).toHaveAttribute("aria-invalid", "true");
        
	});

	it("Check that password errors display correctly", async () => {
		const axiosResponse: AxiosResponse = {
			data: {
				password: ["This password is too short.", 
					"It must contain at least 8 characters.", 
					"This password is too common.", 
					"This password is entirely numeric."],
			},
			status: 400, 
			statusText: "BAD Request", 
			config: {},
			headers: {}
		};

		render(<RegisterView />);

		mocked(axios).mockResolvedValue(axiosResponse);

		const submitButton = screen.getByRole("button", {name: "Sign Up"});

		await waitFor(() => {
			fireEvent.click(submitButton);
		});
        
		//screen.debug(undefined, Infinity);

		expect(screen.getByText("This password is too short. It must contain at least 8 characters. This password is too common. This password is entirely numeric.")).toBeInTheDocument();
        
	});
});