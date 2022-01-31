import React from "react";
import { render } from "@testing-library/react";

import BasicCard from "../basicCard";

describe("Testing BasicCard component", () => {
	
	it("Should mount", () => {
		render(<BasicCard actionArea={false} content={<div></div>}/>);
	});
});