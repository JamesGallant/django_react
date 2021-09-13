
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing";

import { accountsClient } from '../APImethods';

import type { AxiosError } from '../../types/types';

jest.mock("axios");

describe("Testing authentication API calls", () => {
    let client: accountsClient;
    let axiosResponse: AxiosResponse;
    let axiosErrorResponse: AxiosError

    beforeEach(() => {
        client = new accountsClient();
        axiosResponse = {
            data: {},
            status: 123, 
            statusText: "OK", 
            config: {},
            headers: {}
        };

        axiosErrorResponse = {
            response: {
                data: {},
                status: 400, 
                statusText: "Unauthorized", 
                config: {},
                headers: {}
            }
        };

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("logs out successfully", async () => {
        axiosResponse.status = 204;
        mocked(axios).mockResolvedValue(axiosResponse);

        const response: AxiosResponse = await client.tokenLogout("123");

        expect(response.status).toBe(204);
    });

    it("activeUserAccount and sendEmail returns status code correctly", async () => {

        axiosResponse.status = 200;
        mocked(axios).mockResolvedValue(axiosResponse);
        
        const response_activateUser = await client.activateUserAccount("Hello", "World")
        const response_sendEmail = await client.sendEmail("email@email.com")
    
        expect(response_activateUser).toBe(200)
        expect(response_sendEmail).toBe(200)
    });
    
    it("registerUser returns error status code and data", async () => {
        let data = {
            first_name: ["This is a error message"], 
            last_name: ["This is a error message"],
            email: ["This is a error message", "This is also a error message"],
            country: ["This is a error message"],
            password: ["This is a error message"]
        };

        axiosResponse.status = 201;
        axiosResponse.data = data;

        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.registerUser({})
        expect(response.data).toEqual(data)
        expect(response.status).toEqual(201)
    
    });

    it("login retruns errors correctly", async () => {
        let data = {
            non_field_errors: ["This is a error message"], 
        };

        axiosResponse.data = data;
        axiosResponse.status = 400;

        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.tokenLogin("email@email.com", "invalidPassword")
       
        expect(response.data.non_field_errors).toEqual(["This is a error message"])
        expect(response.status).toEqual(400)
    
    });

    it("login retruns auth token correctly", async () => {
        const  data = {
            auth_token: "randomstringofints", 
        };

        axiosResponse.data = data;
        axiosResponse.status = 200;

        mocked(axios).mockResolvedValue(axiosResponse);
    
        const response = await client.tokenLogin("email@email.com", "validPassword")

        expect(response.data.auth_token).toEqual("randomstringofints")
        expect(response.status).toEqual(200)
    
    });

    it("returns user data correctly", async () => {
        let data = {
            first_name: "fname",
            last_name: "lname",
            mobile_number: "0600000000",
            country: "country" 
        }
        
        axiosResponse.data = data;
        axiosResponse.status = 200;

        mocked(axios).mockResolvedValue(axiosResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    });

    it("displays error on missing token", async () => {
        let data = {
            "detail": "Authentication credentials were not provided."
        };

        axiosErrorResponse.response.data = data;
        axiosErrorResponse.response.status = 401;
        mocked(axios).mockRejectedValue(axiosErrorResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    });

    it("displays error on malformed token", async () => {
        let data = {
            "detail": "Invalid token."
        };

        axiosErrorResponse.response.data = data;
        axiosErrorResponse.response.status = 401;
        mocked(axios).mockRejectedValue(axiosErrorResponse);
        const response = await client.getUserData("someEncryptedToken");

        expect(response).toEqual(data);
    })
});
