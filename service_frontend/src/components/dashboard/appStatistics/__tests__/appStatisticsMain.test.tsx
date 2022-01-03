import React from "react";
import { render } from "@testing-library/react";

import AppStatisticsMain from "../AppStatisticsMain";

describe("Testing the entry component of the statistics application", () => {
	it("should mount", () => {
		render(
			<AppStatisticsMain />
		);
	});
});