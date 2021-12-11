import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store";
import App from "../App";

/**
 * @author James Gallant
 * 
 * @description Testing app component, it is where the router lives and should do nothing more than load. Child components will be 
 * indvidually tested
 **/

// smoke test
it("App component renders", () => {
	const history = createMemoryHistory();
	render(
		<Provider store={store}>
			<Router history={history}>
				<App />
			</Router>
		</Provider>
	);
});
