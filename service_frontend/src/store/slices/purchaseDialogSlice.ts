import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import type { PurchaseDialogData, configurationInterface } from "../../types/purchaseDialogTypes";
import type { PurchaseDialogStateInterface } from "../../types/store";
import type { subscriptionOptions } from "../../types/applicationTypes";

const initialState: PurchaseDialogStateInterface = {
	purchaseDialogReducer: {
		data: {
			steps: ["Subscriptions", "configure plan", "payment options", "complete"],
			activeStep: 0,
			appID: 0,
			selectedSubscription: "UNDEFINED",
			cardSelection: {
				demo: false,
				basic: false,
				premium: false
			},
			configuration: {
				duration: 1,
				durationText: "1  month",
				multiplier: 1,
				discountInfo: "",
			}
		}
	}
};

export const PurchaseDialogSlice = createSlice({
	name: "purchaseDialog",
	initialState,
	reducers:{
		setActiveStep: (state, action: PayloadAction<number>) => {
			if (action.payload > state.purchaseDialogReducer.data.steps.length) {
				state.purchaseDialogReducer.data.activeStep = 0;
			} else {
				state.purchaseDialogReducer.data.activeStep = action.payload;
			}
			
		},
		setAppID: (state, action: PayloadAction<number>) => {
			state.purchaseDialogReducer.data.appID = action.payload;
		},
		setSelectedSubscription: (state, action: PayloadAction<subscriptionOptions>) => {
			state.purchaseDialogReducer.data.selectedSubscription = action.payload;
			switch(action.payload) {
			case "DEMO": {
				state.purchaseDialogReducer.data.cardSelection = {
					demo: true,
					basic: false, 
					premium: false
				};
				break;
			}
			case "BASIC": {
				state.purchaseDialogReducer.data.cardSelection = {
					demo: false,
					basic: true, 
					premium: false
				};
				break;
			}
			case "PREMIUM": {
				state.purchaseDialogReducer.data.cardSelection = {
					demo: false,
					basic: false, 
					premium: true
				};
				break;
			}
			}
		},
		setConfiguration: (state, action: PayloadAction<configurationInterface>) => {
			state.purchaseDialogReducer.data.configuration = {
				duration: action.payload.duration,
				durationText: action.payload.durationText,
				multiplier: action.payload.multiplier,
				discountInfo: action.payload.discountInfo,
			};
		},
		resetPurchaseDialog: (state) => {
			state.purchaseDialogReducer.data = {
				steps:  ["Subscriptions", "configure plan", "payment options", "complete"],
				activeStep: 0,
				appID: 0,
				selectedSubscription: "UNDEFINED",
				cardSelection: {
					demo: false,
					basic: false,
					premium: false
				},
				configuration: {
					duration: 1,
					durationText: "1  month",
					multiplier: 1,
					discountInfo: "",
				}
			};
		}
	}
});

export const { setSelectedSubscription, resetPurchaseDialog, setConfiguration, setActiveStep, setAppID } = PurchaseDialogSlice.actions;
export const selectPurchaseDialogData = (state: RootState): PurchaseDialogData => state.purchaseDialog.purchaseDialogReducer; 
export default PurchaseDialogSlice.reducer;