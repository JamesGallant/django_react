import React from 'react';
import {render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';

import RegisterComponent from '../components/registerComponent'
import RegisterPage from '../pages/register'
import { act } from 'react-dom/test-utils';

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

    it("displays errors on worst case", async () => {
        /**
         * @resources for mocking axios: https://www.npmjs.com/package/axios-mock-adapter
         * @resource for mocking axios https://stackoverflow.com/questions/66717173/how-to-test-axios-requests-in-react-testing-library-and-jest
         */
    });
})