import React from "react";
import { render } from "@testing-library/react";

import SettingsBilling from "../SettingsBilling";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsBilling />);
	});
});