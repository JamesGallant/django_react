import React from 'react';
import { act,  cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import PasswordField from '../../components/formFields/passwordComponent';

afterEach(cleanup);

jest.useFakeTimers();

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

    it("toggle password display", async () => {
        render(<PasswordField value="somePassword" inputProps={{'data-testid': 'testPassword'}} />);

        const hiddenPassword = screen.getByTestId('testPassword') as HTMLInputElement;
        const toggleButton = screen.getByRole('button', {'name': 'toggle-pw-visibility'})
        expect(hiddenPassword).toHaveAttribute('type', 'password');
        
        await waitFor(() => {
            fireEvent.click(toggleButton)
        });
        
        const displayedPassword = screen.getByTestId('testPassword') as HTMLInputElement
        expect(displayedPassword).toHaveAttribute('type', 'text')
    });

    it("removes tooltip adornment", () => {
        render(<PasswordField showTooltip={false} inputProps={{'data-testid': 'testPassword'}} />);
        const helpButton = screen.queryByRole('button', {'name': 'display-pw-info'});
        expect(helpButton).not.toBeInTheDocument();
    })

    it("display help", async() => {
        // also test clickaway and timers
        render(<PasswordField showTooltip={true} inputProps={{'data-testid': 'testPassword'}} />);

        const helpButton = screen.getByRole('button', {'name': 'display-pw-info'});
        const toolTipHidden = screen.queryByRole('tooltip');
        expect(toolTipHidden).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(helpButton);
            jest.advanceTimersByTime(8000); 
            expect(screen.queryByText("At least 8 characters")).not.toBeInTheDocument();
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 8000);  
        });
        //expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();  

    })

})

