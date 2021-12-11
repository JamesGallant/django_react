import React from "react";
import { render } from "@testing-library/react";

import AlertDialog from "../AlertDialog";

describe("Testing BasicModal component", () => {
	
	it("Should mount", () => {
		render(<AlertDialog />);
	});
});