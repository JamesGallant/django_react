import React from "react";
import { render } from "@testing-library/react";

import BasicSpinner from "../basicSpinnerComponent";

describe("testing basicSpinner component", () => {
	/**
     * @Describe Testing of the copyright component. 
     * 
     * @Test only needs a smoke test
     */

	it("Spinner renders correctly", () => {
		render(<BasicSpinner />);
	});
});