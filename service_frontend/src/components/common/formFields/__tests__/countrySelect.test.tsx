import React from "react";
import {render} from "@testing-library/react";

import CountrySelect from "../countryComponent";

describe("testing countrySelect component", () => {
	/**
     * @Description Mostly handled by MUI so no need to test
     */

	it("loads correctly", () => {
		render(<CountrySelect />);
	});
});