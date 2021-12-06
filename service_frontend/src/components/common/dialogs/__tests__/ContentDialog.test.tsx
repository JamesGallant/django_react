import React from "react";
import { render } from "@testing-library/react";

import ContentDialog from "../ContentDialog";

describe("Testing BasicModal component", () => {
	
	it("Should mount", () => {
		render(<ContentDialog />);
	});
});