import React from "react";
import { render } from "@testing-library/react";

import SettingsApps from "../settingsApps";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsApps />);
	});
});