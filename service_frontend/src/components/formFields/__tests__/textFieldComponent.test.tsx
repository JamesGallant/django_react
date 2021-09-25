import React from "react";
import { cleanup, render, screen } from "@testing-library/react";

import TextField from "../../../components/formFields/TextFieldComponent";

afterEach(cleanup);

describe("testing textField component", () => {
	/**
     * @Description Tests the Textfield component which extends the material ui TextField component with added error handling
     * 
     * @test invalid entry, error Message has data which is passed from parent component. displays error
     * @test valid entry, empty array [""] passed from parent component.
     * @test loading of the component
     */

	it("Page renders correctly", () => {
		render(<TextField />);
	});

	it("Error is displayed",  () => {
		render(<TextField
			required
			fullWidth
			id="lname"
			name="lastName"
			label="Last Name"
			value=""
			errorMessage={ ["This field is required"] }
			inputProps={{"data-testid": "testError"}}
		/>);

		expect(screen.getByText("This field is required")).toBeInTheDocument();
		expect(screen.getByTestId("testError")).toHaveAttribute("aria-invalid", "true");
        
	});

	it("valid entry",  () => {
		render(<TextField 
			name="testName" 
			label="testLabel"
			id="testId"
			inputProps={{"data-testid": "testError"}}
			errorMessage={ [""] }
			value="someText"/>);

		expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
		expect(screen.getByLabelText("testLabel")).toHaveAttribute("aria-invalid", "false");
		expect(screen.getByLabelText("testLabel")).toHaveAttribute("value", "someText");
        
	});
});