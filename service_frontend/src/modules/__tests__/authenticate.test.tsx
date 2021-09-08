import authenticate from "../authenticate";
import CookieHandler from "../cookies";

import type { AxiosError } from '../../types/types';

jest.mock("axios");

describe("Testing authentication", () => {
    let getCookieMock;
    beforeAll(() => {

    })
    beforeEach(() => {

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set authenticated to false when cookie is not present", () => {
        let cookies = new CookieHandler()
    })
})