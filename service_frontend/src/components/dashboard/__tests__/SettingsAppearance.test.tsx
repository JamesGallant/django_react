import React from "react";
import { render } from "@testing-library/react";

import SettingsAppearance from "../SettingsAppearance";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsAppearance />);
	});
});