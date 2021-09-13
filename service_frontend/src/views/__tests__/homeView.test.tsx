import { render } from "@testing-library/react";

import HomeView from "../homeView";
import { login } from "../../modules/authenticate";

jest.mock('../../modules/authenticate')
describe("Testing home view functionality", () => {
    it("Mounts", () => {
        render(<HomeView />);
        expect(login).toHaveBeenCalledTimes(1);
    });
})