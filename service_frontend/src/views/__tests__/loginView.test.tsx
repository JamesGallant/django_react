import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing";
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';

import LoginView from '../loginView';
import CookieHandler from '../../modules/cookies';
import { accountsClient } from '../../modules/APImethods';
import configuration from '../../utils/config';

import {login} from "../../modules/authenticate";

jest.mock('axios');
jest.mock("../../modules/authenticate");

describe("Testing login", () => {
    afterEach(() => {
        jest.resetAllMocks();
      });

    it("component renders correctly", () => {
        render(<LoginView/>)
    });

    it("Error is displayed on invalid account", async () => {
        let client = new accountsClient()
        
        const axiosResponse: AxiosResponse = {
            data: {
                non_field_errors: ["Some error"]
            },
            status: 400, 
            statusText: "Bad Request", 
            config: {},
            headers: {}
        };

        const wrapper = render(<LoginView />);
        const submitButton = wrapper.getByRole('button', {name: "Sign in"});

        mocked(axios).mockResolvedValue(axiosResponse);
        let response = await client.tokenLogin("", "");

        await waitFor(() => {
            fireEvent.click(submitButton);
        });

        expect(response.status).toBe(400);
        expect(await wrapper.findByText("Invalid username or password")).toBeInTheDocument();

    })

    it("displays field errors if input is invalid or missing", async () => {
        let client = new accountsClient()

        const axiosResponse: AxiosResponse = {
            data: {
                email: ["This field is required"],
                password: ["This field is required"]
            },
            status: 400, 
            statusText: "Bad Request", 
            config: {},
            headers: {}
        };

        const wrapper = render(<LoginView />);
        const email = wrapper.getByRole('textbox', {name: "email"})

        const submitButton = wrapper.getByRole('button', {name: "Sign in"});

        mocked(axios).mockResolvedValue(axiosResponse);
        let response = await client.tokenLogin("", "");

        await waitFor(() => {
            fireEvent.click(submitButton);
        });

        expect(response.status).toBe(400);
        expect(wrapper.getAllByText("This field is required")[0]).toBeInTheDocument();
        expect(wrapper.getAllByText("This field is required").length).toBe(2);
        expect(email).toHaveAttribute('aria-invalid', 'true');
    })

    it("sets cookies and routes to dashboard on successfull login", async () => {
        const history = createMemoryHistory();
        
        let client = new accountsClient()

        const axiosResponse: AxiosResponse = {
            data: {
                auth_token: "123456789"
            },
            status: 200, 
            statusText: "Ok", 
            config: {},
            headers: {}
        };

        render(<Router history={history}>
            <LoginView />
            </Router>)

         mocked(axios).mockResolvedValue(axiosResponse);

        let response = await client.tokenLogin("", "");
        jest.spyOn(CookieHandler.prototype, 'setCookie')
        jest.spyOn(window.localStorage.__proto__, 'setItem')
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', {name: "Sign in"}));
        });
        
        expect(response.status).toBe(200)
        expect(response.data.auth_token).toEqual("123456789")
        expect(CookieHandler.prototype.setCookie).toHaveBeenCalledTimes(1)
        expect(window.localStorage.setItem).toBeCalledWith("authenticated", "true");
        expect(history.location.pathname).toBe(configuration["url-dashboard"])
    })

    it("redirects to dash if already authenticated", () => {
        const history = createMemoryHistory();
       
        render(<Router history={history}>
            <LoginView />
            </Router>);

       
        expect(login).toHaveBeenCalledTimes(1);
        expect(history.location.pathname).toBe(configuration["url-dashboard"]);
        
    });
})