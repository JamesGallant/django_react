import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import BasicSpinner from "./components/common/spinner/basicSpinnerComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<Provider store= { store }>
			<PersistGate loading={<BasicSpinner />} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route path="/*" element={ <App /> } />
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
