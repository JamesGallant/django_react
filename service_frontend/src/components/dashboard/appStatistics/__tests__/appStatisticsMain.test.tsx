import React from "react";
import { render } from "@testing-library/react";

import AppStatisticsMain from "../appStatisticsMain";

describe("Testing the entry component of the statistics application", () => {
	it("should mount", () => {
		render(
			<AppStatisticsMain />
		);
	});
});