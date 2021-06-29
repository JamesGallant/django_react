
import axios, { AxiosResponse } from "axios";
import { mocked } from "ts-jest/dist/utils/testing"; //<-- This allows to mock results

import { accountsClient } from '../utils/APImethods';

jest.mock("axios");

test("activeUserAccount and sendEmail returns status code correctly", async () => {
    let http = new accountsClient()

    const axiosResponse: AxiosResponse = {
        data: [""],
        status: 400, 
        statusText: "OK", 
        config: {},
        headers: {}
    };

    mocked(axios).mockResolvedValue(axiosResponse);
    
    const response_activateUser = await http.activateUserAccount("Hello", "World")
    const response_sendEmail = await http.sendEmail("email@email.com")

    expect(response_activateUser).toBe(400)
    expect(response_sendEmail).toBe(400)
});

test("registerUser returns error status code and data", async () => {
    let client = new accountsClient()

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
    console.log(response.data.first_name)
    expect(response.data.first_name).toEqual(["This is a error message"])
    expect(response.data.email).toEqual(["This is a error message", "This is also a error message"])
    expect(response.status).toEqual(201)

})
test("dummy test", () => {
    let http = new accountsClient()
    expect(http.dummy()).toBe("HelloWorld");
});
