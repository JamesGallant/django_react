import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PaletteMode } from "@mui/material";
import type { SiteConfigInterface, SiteConfigDataInterface, ThemePreferenceInterface } from "../../types/store";

const initialState: SiteConfigInterface = {
	siteConfigReducer: {
		data: {
			clearLoginCache: false,
			themePreference: {
				setting: "syncTheme",
				mode: "light",
			}
		}
	}
};

export const siteConfigSlice = createSlice({
	name: "siteConfiguration",
	initialState,
	reducers:{
		toggleClearLoginCache: (state) => {
			state.siteConfigReducer.data.clearLoginCache = !state.siteConfigReducer.data.clearLoginCache;
		},
		setThemePreference: (state, action: PayloadAction<string>) => {
			console.log("store", action.payload);
			state.siteConfigReducer.data.themePreference.setting = action.payload;
		},
		setThemeMode: (state, action: PayloadAction<PaletteMode>) => {
			state.siteConfigReducer.data.themePreference.mode = action.payload;
		}
	}
});

export const { toggleClearLoginCache, setThemePreference, setThemeMode } = siteConfigSlice.actions;
export const selectSiteTheme = (state: RootState): ThemePreferenceInterface => state.siteConfiguration.siteConfigReducer.data.themePreference;
export const selectSiteConfigData = (state: RootState): SiteConfigDataInterface => state.siteConfiguration.siteConfigReducer;
export const selectSiteConfigReducer =  (state: RootState): SiteConfigInterface => state.siteConfiguration;
export default siteConfigSlice.reducer;