import React from "react";
import { render} from "@testing-library/react";
import { BrowserRouter, Switch } from "react-router-dom";

import configuration from "../../../../utils/config";
import DashboardView from "../../../views/dashboard/dashboardView";
import PrivateRoute from "../privateRoute";

describe("Testing private routes", () => {
	it("renders correctly", () => {
		render(<BrowserRouter>
			<Switch>
				<PrivateRoute redirectTo={configuration["url-login"]}>
					<DashboardView />
				</PrivateRoute>
			</Switch>
		</BrowserRouter>);
	});
});