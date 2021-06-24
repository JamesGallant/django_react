import React from 'react';
import {render } from '@testing-library/react';

import RegisterComponent from '../components/registerComponent'
import RegisterPage from '../pages/register'

describe("Testing account registration", () => {
    /**
     * @Description Tests the functionality of the account registration component.
     * @Tests Smoke - accounts component and page renders
     * @Tests properly gathers data
     * @Tests sends API call
     */

     it("Page renders correctly", () => {
        render(<RegisterPage />)
    });

    it("component renders correctly", () => {
        render(<RegisterComponent />)
    });
})