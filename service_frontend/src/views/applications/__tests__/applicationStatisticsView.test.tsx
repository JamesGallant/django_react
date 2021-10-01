import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { store } from "../../../store/store";

import ApplicationStatisticsView from "../applicationStatisticsView";

describe("Testing the dashboard view", () => {
	it("mounts", () => {    
		const history = createMemoryHistory();
		render(
			<Provider store={store}>
				<Router history={history}>
					<ApplicationStatisticsView />
				</Router>
			</Provider>);
	});
});
