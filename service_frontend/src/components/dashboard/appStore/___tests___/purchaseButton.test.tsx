import React from "react";
import { render } from "@testing-library/react";

import PurchaseButton from "../purchaseButton";

describe("Testing AppStore purchase button", () => {
	it("Should mount", () => {
		render(
			<PurchaseButton 
				disabled={false}
				purchased={false}
				onClick = {() => null}
			/>
		);
	});

	it("Should display coming soon if app is disabled", () => {
		const wrapper = render(
			<PurchaseButton 
				disabled={true}
				purchased={false}
				onClick = {() => null}
			/>
		);

		expect(wrapper.getByText("Coming Soon")).toBeInTheDocument();
	});

	it("Should display owned if app is purchased", () => {
		const wrapper = render(
			<PurchaseButton 
				disabled={false}
				purchased={true}
				onClick = {() => null}
			/>
		);

		expect(wrapper.getByText("OWNED")).toBeInTheDocument();
	});

	it("Should display purchase if app is not owned", () => {
		const wrapper = render(
			<PurchaseButton 
				disabled={false}
				purchased={false}
				onClick = {() => null}
			/>
		);
		
		const purchaseBtn: HTMLElement = wrapper.getByRole("button");

		expect(purchaseBtn).toHaveTextContent("Purchase");
	});

});