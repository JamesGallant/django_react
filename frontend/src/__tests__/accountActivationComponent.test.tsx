import React from 'react';
import { render, screen } from '@testing-library/react';

import AccountActivation from '../components/accountActivationComponent'


describe("testing account activation component", () => {
    /**
     * @description Tests the message and behaviour of account activation message that displays on the parent component AccountsActivation
     * page.
     * 
     * @tests Test different message displays based on codes and behaviour when parent component is not loaded correctly
     * 
     * @metadata
     *  - status codes: 204, 403, 400
     *  - isComponentLoaded: True/False
     */

    // smoke test
    it('component renders corretly', () => {
      render(<AccountActivation isComponentLoaded={ true } status = {204} />)
    })

    // display messages
    it('204 message displays correctly', () => {
        render(<AccountActivation isComponentLoaded={ true } status={204} />);
        const message = "You're account is now active, you can now login to your account or return to the home page"
        expect(screen.getByText(message, {exact: false})).toBeInTheDocument()
    })

    it('403 message displays correctly', () => {
        render(<AccountActivation isComponentLoaded={ true } status={403} />);
        const message = "You're account has previously been activated,"
        expect(screen.getByText(message, {exact: false})).toBeInTheDocument()
    });

    it('400 message displays correctly', () => {
        render(<AccountActivation isComponentLoaded={ true } status={400} />);
        const message = "We don't have a record for your account"
        expect(screen.getByText(message, {exact: false})).toBeInTheDocument()
    });

    // button redirects
    it('home button redirects home', () => {
        render(<AccountActivation isComponentLoaded={ true } status={204} />);
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/')
    });

    it('Login button redirects to login', () => {
        render(<AccountActivation isComponentLoaded={ true } status={204} />);
        expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login')
    });

    // unloaded shows spinner
    it('spinner loads on isComponentLoaded = false',  () => {
        const { getByRole } = render(<AccountActivation isComponentLoaded={ false } status={0} />);
        const spinner = getByRole("progressbar")
        expect(spinner).toBeTruthy()
    });

  });