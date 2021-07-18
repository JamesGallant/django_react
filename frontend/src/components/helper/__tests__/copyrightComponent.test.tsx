import React from 'react';
import { render } from '@testing-library/react';

import Copyright from "../copyrightComponent";


describe("testing copyright component", () => {
    /**
     * @Describe Testing of the copyright component. 
     * 
     * @Test only needs a smoke test
     */

    it("Page renders correctly", () => {
        render(<Copyright />)
    })
});