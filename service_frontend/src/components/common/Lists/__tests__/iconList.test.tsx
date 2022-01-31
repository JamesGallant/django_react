import React from "react";
import { render } from "@testing-library/react";

import IconList from "../iconList";

describe("Testing IconList component", () => {
	
	it("Should mount", () => {
		render(<IconList primaryText="" icon={<div></div>}/>);
	});
});