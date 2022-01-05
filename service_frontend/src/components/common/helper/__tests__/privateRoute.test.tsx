import React from "react";
import { render} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Routes, Router, Route } from "react-router-dom";

import configuration from "../../../../utils/config";
import DashboardView from "../../../views/dashboard/dashboardView";
import PrivateRoute from "../privateRoute";

describe("Testing private routes", () => {
	const history = createMemoryHistory();
	it("renders correctly", () => {
		render(<Router navigator={history} location={history.location}>
			<Routes>
				<Route path={"/*" } element={
					<PrivateRoute redirectTo={configuration["url-login"]}>
						<DashboardView/>
					</PrivateRoute>
				} />
			</Routes>
		</Router>);
	});
});