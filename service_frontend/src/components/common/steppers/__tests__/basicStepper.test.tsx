import React from "react";
import { render } from "@testing-library/react";

import BasicStepper from "../basicStepper";

describe("Testing BasicStepper componenent", () => {
	it("Should Mount", () => {
		render(
			<BasicStepper steps={["1", "2", "3"]} activeStep={0}/>
		);
	});
});