import React from "react";
import { render } from "@testing-library/react";

import MediaCard from "../MediaCard";

describe("Testing MediaCard component", () => {
	
	it("Should mount", () => {
		render(<MediaCard mediaComponent="img"/>);
	});
});