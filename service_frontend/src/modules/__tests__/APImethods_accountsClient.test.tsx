
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing";

import { accountsClient } from '../APImethods';

import type { AxiosError } from '../../types/types';

jest.mock("axios");

describe("Testing authentication API calls", () => {
    let client: accountsClient;
    beforeEach(() => {
        client = new accountsClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("activeUserAccount and sendEmail returns status code correctly", async () => {
    
        const axiosResponse: AxiosResponse = {
            data: [""],
            status: 400, 
            statusText: "OK", 
            config: {},
            headers: {}
        };
    
        mocked(axios).mockResolvedValue(axiosResponse);
        
        const response_activateUser = await client.activateUserAccount("Hello", "World")
        const response_sendEmail = await client.sendEmail("email@email.com")
    
        expect(response_activateUser).toBe(400)
        expect(response_sendEmail).toBe(400)
    });
    
    it("registerUser returns error status code and data", async () => {

        const axiosResponse: AxiosResponse = {
            data: {
                first_name: ["This is a error message"], 
                last_name: ["This is a error message"],
                email: ["This is a error message", "This is also a error message"],
                country: ["This is a error message"],
                password: ["This is a error message"]
            },
            status: 201, 
            statusText: "OK", 
            config: {},
            headers: {}
        };
        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.registerUser({})
        expect(response.data.first_name).toEqual(["This is a error message"])
        expect(response.data.email).toEqual(["This is a error message", "This is also a error message"])
        expect(response.status).toEqual(201)
    
    });

    it("login retruns errors correctly", async () => {

        const axiosResponse: AxiosResponse = {
            data: {
                non_field_errors: ["This is a error message"], 
            },
            status: 400, 
            statusText: "Bad Request", 
            config: {},
            headers: {}
        };
        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.tokenLogin("email@email.com", "invalidPassword")
       
        expect(response.data.non_field_errors).toEqual(["This is a error message"])
        expect(response.status).toEqual(400)
    
    });

    it("login retruns auth token correctly", async () => {

        const axiosResponse: AxiosResponse = {
            data: {
                auth_token: "randomstringofints", 
            },
            status: 200, 
            statusText: "Ok", 
            config: {},
            headers: {}
        };
        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.tokenLogin("email@email.com", "validPassword")

        expect(response.data.auth_token).toEqual("randomstringofints")
        expect(response.status).toEqual(200)
    
    });

    it("returns user data correctly", async () => {
        const data = {
            first_name: "fname",
            last_name: "lname",
            mobile_number: "0600000000",
            country: "country" 
        }
        const axiosResponse: AxiosResponse = {
            data: {},
            status: 200, 
            statusText: "Ok", 
            config: {},
            headers: {}
        };
        axiosResponse.data = data;

        mocked(axios).mockResolvedValue(axiosResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    });

    it("displays error on nissing token", async () => {
        const data = {
            "detail": "Authentication credentials were not provided."
        };

        const axiosResponse: AxiosError = {
            response: {
                data: {},
                status: 401, 
                statusText: "Unauthorized", 
                config: {},
                headers: {}
            }
        };

        axiosResponse.response.data = data;
        mocked(axios).mockRejectedValue(axiosResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    });

    it("displays error on malformed token", async () => {
        const data = {
            "detail": "Invalid token."
        };

        const axiosResponse: AxiosError = {
            response: {
                data: {},
                status: 401, 
                statusText: "Unauthorized", 
                config: {},
                headers: {}
            }
        };

        axiosResponse.response.data = data;
        mocked(axios).mockRejectedValue(axiosResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    })
});
