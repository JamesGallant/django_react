import React from "react";
import { render } from "@testing-library/react";

import Statistics from "../statistics";

describe("Testing the entry component of the statistics application", () => {
	it("should mount", () => {
		render(
			<Statistics />
		);
	});
});