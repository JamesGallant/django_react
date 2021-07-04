import React from 'react';
import { render } from '@testing-library/react';

import LoginPage from '../pages/login';
import Login from '../components/loginComponent';

describe("Testing login", () => {
    it("view renders successfully", () => {
        render(<LoginPage />)
    });

    it("component renders correctly", () => {
        render(<Login/>)
    });
})