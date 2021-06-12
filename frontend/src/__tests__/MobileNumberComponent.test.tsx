import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import MobileNumber from '../components/formFields/MobileNumberComponent'

afterEach(cleanup);

describe("testing phonenumber component", () => {
    /**
     * @Description Tests the implementation of the mobile phone component
     * 
     * @tests smoke test, phonenumber value displays edited to international format, errors are displayed
     */

    it("renders correnctly", () => {
        render(<MobileNumber value="+31619775584" validate="ValidatePhoneNumber"/>)
    })

    it("displays errors correctly", () => {
        render(<MobileNumber 
                    value="Hello"
                    required={true}
                    fullWidth
                    id="mobileNumber"
                    name="mobileNumber"
                    label="mobile number"
                    validate="ValidatePhoneNumber"
                    countryCode="NL"
                    didSubmit={true}
                    inputProps={{'data-testid': 'testMobile'}}/>)

        
        const showInput = screen.getByTestId('testMobile') as HTMLInputElement;

        expect(showInput).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText("Phone number is invalid")).toBeInTheDocument()
    })
})