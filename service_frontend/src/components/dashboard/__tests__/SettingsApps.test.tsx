import React from "react";
import { render } from "@testing-library/react";

import SettingsApps from "../SettingsApps";

describe("Testing profile settings", () => {
	it("Mounts", () => {
		render(<SettingsApps />);
	});
});