import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import TextField from '../components/formFields/TextFieldComponent'

afterEach(cleanup);

describe("testing textField component", () => {
    /**
     * @Description Tests the Textfield component which extends the material ui TextField component with added error handling
     * 
     * @test loading of the component
     * @test label displays in textField
     * @test no empty fields error displays both red boundary and helper text
     */

    it("Page renders correctly", () => {
        render(<TextField />)
    });

    it("label is displayed", () => {
        render(<TextField 
            name="testName" 
            label="testLabel"
            id="testId"/>)

        expect(screen.getByText("testLabel")).toBeInTheDocument()
    });

    it("noEmptyFields error is displayed", async () => {
        render(<TextField 
                name="testName" 
                label="testLabel"
                id="testId"
                value=""
                validate="noEmptyFields"
                didSubmit={true}/>)

        

        expect(screen.getByText("This field is required")).toBeInTheDocument()
        expect(screen.getByLabelText('testLabel')).toHaveAttribute('aria-invalid', "true")
        
    });

    it("valid entry", async () => {
        render(<TextField 
                name="testName" 
                label="testLabel"
                id="testId"
                value="someText"
                validate="noEmptyFields"
                didSubmit={true}/>)

        expect(screen.queryByText("This field is required")).not.toBeInTheDocument()
        expect(screen.getByLabelText('testLabel')).toHaveAttribute('aria-invalid', "false")
        expect(screen.getByLabelText('testLabel')).toHaveAttribute('value', "someText")
        
    });

    it("not submitted", async () => {
        render(<TextField 
                name="testName" 
                label="testLabel"
                id="testId"
                value=""
                validate="noEmptyFields"
                didSubmit={false}/>)

        expect(screen.queryByText("This field is required")).not.toBeInTheDocument()
        expect(screen.getByLabelText('testLabel')).toHaveAttribute('aria-invalid', "false")
    })
});