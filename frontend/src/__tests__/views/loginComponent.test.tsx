import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing";

import LoginView from '../../views/loginView';
import CookieHandler from '../../utils/cookies';
import { accountsClient } from '../../utils/APImethods';


jest.mock('axios');

describe("Testing login", () => {

    it("component renders correctly", () => {
        render(<LoginView/>)
    });

    it("login functions correctly", async () => {
        /**
         * @description tests that api call is made and cookie is set 
         * when users correctly logs in
         */

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

        const wrapper = render(<LoginView />)
        jest.spyOn(CookieHandler.prototype, 'setCookie')
        const submitButton = wrapper.getByRole('button', {name: "Sign in"})
       
        mocked(axios).mockResolvedValue(axiosResponse);
        let response = await client.tokenLogin("", "");

        await waitFor(() => {
            fireEvent.click(submitButton)
        })

        expect(response.data.auth_token).toEqual("123456789")
        expect(CookieHandler.prototype.setCookie).toHaveBeenCalledTimes(1)

    });

    it("Error is displayd on invalid account", async () => {
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
        expect(await wrapper.findByText("Incorrect username or password")).toBeInTheDocument();

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
})