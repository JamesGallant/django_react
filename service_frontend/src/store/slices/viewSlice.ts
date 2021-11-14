import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { ViewsStateInterface, DashboardInterface } from "../../types/store"; 


const initialState: ViewsStateInterface = {
	viewReducer: {
		stateStatus: "idle",
		dashboard: {
			settings: false,
			profile: false,
			appstore: true,
		}
	}
};

export const viewsSlice = createSlice({
	name: "views",
	initialState,
	reducers: {
		toggleDashboardView: (state, action: PayloadAction<string>) => {
			state.viewReducer.stateStatus = "loading";
			switch(action.payload) {
			case "settings": {
				state.viewReducer.dashboard.settings = true;
				state.viewReducer.dashboard.appstore = false;
				state.viewReducer.dashboard.profile = false;
				break;
			}
			case "profile": {
				state.viewReducer.dashboard.settings = false;
				state.viewReducer.dashboard.appstore = false;
				state.viewReducer.dashboard.profile = true;
				break;
			}
			case undefined:
			case "":
			case "appstore": {
				state.viewReducer.dashboard.settings = false;
				state.viewReducer.dashboard.appstore = true;
				state.viewReducer.dashboard.profile = false;
				break;
			}
			default: {
				state.viewReducer.stateStatus = "failed";
				throw new Error(`Error in toggleDashboardView state, expected (settings | profile | appstore) payload but recieved ${action.payload}`);
			}
			}
			state.viewReducer.stateStatus = "idle";
		},
	},
});

export const { toggleDashboardView } = viewsSlice.actions;
export const selectViewReducer = (state: RootState): ViewsStateInterface => state.views;
export const selectVeiwDashboard = (state: RootState): DashboardInterface => state.views.viewReducer.dashboard;
export default viewsSlice.reducer;
