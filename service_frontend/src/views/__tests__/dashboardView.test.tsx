import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import DashboardView from "../dashboardView";

describe("Testing the dashboard view", () => {

	it("mounts", () => {
		const history = createMemoryHistory();
		render(<Router history={history}>
			<DashboardView />
		</Router>);
	});
});