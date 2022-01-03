import React from "react";
import { render } from "@testing-library/react";

import HomeView from "../homeView";
import { login } from "../../../modules/authentication";

jest.mock("../../../modules/authentication");
describe("Testing home view functionality", () => {
	it("Mounts", () => {
		render(<HomeView />);
		expect(login).toHaveBeenCalledTimes(1);
	});
});