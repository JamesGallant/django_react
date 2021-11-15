import React from "react";
import { render } from "@testing-library/react";

import SettingsAccount from "../SettingsAccount";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsAccount />);
	});
});