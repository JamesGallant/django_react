import React from "react";
import {cleanup, fireEvent, render, screen } from "@testing-library/react";

import CountrySelect from "../countryComponent";


afterEach(cleanup);

describe("testing countrySelect component", () => {
	/**
     * @Description Tests basic functionality of this component such as display and data
     * 
     * @test loading of the component
     * @test hover effects displays correctly
     * @test user should be able to select a country on dropdown
     * @test user should be able to select a country by autocomplete search
     */

	it("loads correctly", () => {
		render(<CountrySelect />);
	});

	it("displays the dropdown when clicked", () => {
		const rendered = render(<CountrySelect inputProps={{"data-testid": "testInput"}}/>);
		const selectButton = rendered.getAllByRole("button");
		const combobox = rendered.getByRole("combobox");
		const textbox = rendered.getByRole("textbox");
		fireEvent.click(selectButton[0]);
		expect(combobox.getAttribute("aria-expanded")).toBe("true");
		expect(textbox.getAttribute("aria-activedescendant")).toBe("select-country-option-0");
		expect(screen.getByText("Andorra")).toBeInTheDocument();
	});

	it("User can choose a valid country", () => {
		const rendered = render(<CountrySelect inputProps={{"data-testid": "testInput"}}/>);
		const textbox = rendered.getByRole("textbox");

		fireEvent.change(textbox, {target: {value: "Netherlands"}});

		expect(textbox.getAttribute("value")).toBe("Netherlands");
		expect(textbox.getAttribute("aria-activedescendant")).toBe("select-country-option-0");
		expect(screen.getByText("Netherlands")).toBeInTheDocument();
	});

	it("displays list of searched countries", () => {
		const rendered = render(<CountrySelect inputProps={{"data-testid": "testInput"}}/>);
		const textbox = rendered.getByRole("textbox");

		fireEvent.change(textbox, {target: {value: "bel"}});
		expect(screen.getByText("Belgium")).toBeInTheDocument();
		expect(screen.getByText("Belize")).toBeInTheDocument();
		expect(screen.getByText("Belarus")).toBeInTheDocument();

	});
});