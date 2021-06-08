import React from 'react';
import { act,  cleanup, fireEvent, render, screen } from '@testing-library/react';

import PasswordField from '../components/formFields/passwordComponent';

afterEach(cleanup);

describe("Testing password field Component", () => {
    /**
     * @Description Tests the Textfield component which extends the material ui password component with added error handling
     * 
     * @test loading of the component
     * @test user should be able to toggle to view the password. Clicking toggles between type=password and type=text
     */

    it("Component renders correctly", () => {
        render(<PasswordField />)
    });

    it("toggle password display", () => {
        render(<PasswordField value="somePassword" inputProps={{'data-testid': 'testPassword'}} />);

        const hiddenPassword = screen.getByTestId('testPassword') as HTMLInputElement;
        const toggleButton = screen.getByRole('button', {'name': 'toggle-pw-visibility'})
        expect(hiddenPassword).toHaveAttribute('type', 'password');

        fireEvent.click(toggleButton)
        const displayedPassword = screen.getByTestId('testPassword') as HTMLInputElement
        expect(displayedPassword).toHaveAttribute('type', 'text')
    });

    it("display help", () => {
        // also test clickaway and timers

        act(() => {
            render(<PasswordField inputProps={{'data-testid': 'testPassword'}} />)  
        })
        const helpButton = screen.getByRole('button', {'name': 'display-pw-info'})
        const toolTipHidden = screen.queryByRole('tooltip')
        expect(toolTipHidden).not.toBeInTheDocument()

        act(() => {
            fireEvent.click(helpButton) 
        });

        expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
})

