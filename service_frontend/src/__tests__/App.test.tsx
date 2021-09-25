import React from "react";
import ReactDOM from "react-dom";
import App from "../App";

/**
 * @author James Gallant
 * 
 * @description Testing app component, it is where the router lives and should do nothing more than load. Child components will be 
 * indvidually tested
 **/

// smoke test
it("App component renders", () => {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
});
