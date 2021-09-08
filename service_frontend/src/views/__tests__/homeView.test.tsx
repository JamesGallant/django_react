import { render } from "@testing-library/react";

import HomeView from "../homeView";
import authenticate from "../../modules/authenticate";

jest.mock('../../modules/authenticate')
describe("Testing home view functionality", () => {
    it("Mounts", () => {
        render(<HomeView />);
        expect(authenticate).toHaveBeenCalledTimes(1);
    });
})