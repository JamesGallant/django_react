import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

import type { SiteConfigInterface, SiteConfigDataInterface } from "../../types/store";

const initialState: SiteConfigInterface = {
	siteConfigReducer: {
		data: {
			clearLoginCache: false
		}
	}
};

export const siteConfigSlice = createSlice({
	name: "siteConfiguration",
	initialState,
	reducers:{
		toggleClearLoginCache: (state) => {
			state.siteConfigReducer.data.clearLoginCache = !state.siteConfigReducer.data.clearLoginCache;
		}
	}
});

export const { toggleClearLoginCache } = siteConfigSlice.actions;
export const selectSiteConfigData = (state: RootState): SiteConfigDataInterface => state.siteConfiguration.siteConfigReducer;
export const selectSiteConfigReducer =  (state: RootState): SiteConfigInterface => state.siteConfiguration;
export default siteConfigSlice.reducer;