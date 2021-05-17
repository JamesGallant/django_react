import React from 'react';
import { cleanup, render } from '@testing-library/react';

import PasswordField from '../components/formFields/passwordComponent';

afterEach(cleanup);

describe("Testing password field Component", () => {
    /**
     * @Description Tests the Textfield component which extends the material ui password component with added error handling
     * 
     * @test loading of the component
     */

    it("Component renders correctly", () => {
        render(<PasswordField />)
    });
})

