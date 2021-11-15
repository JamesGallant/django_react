import React from "react";
import { render } from "@testing-library/react";

import SettingsProfile from "../SettingsProfile";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsProfile />);
	});
});