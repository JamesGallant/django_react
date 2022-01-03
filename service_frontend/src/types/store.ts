import type { UserDataInterface } from "./authentication";
import type { PaletteMode } from "@mui/material";

//#region user
export interface stateError {
	message: string,
	name: string,
	stack: string
}

export interface UserStateInterface {
    userReducer: {
        stateStatus: string,
        data: UserDataInterface,
        error: stateError | unknown
    }
}

//#endregion

//#region views
export interface ViewsStateInterface {
	viewReducer: {
		stateStatus: string,
		dashboard: DashboardInterface,
	}
}

export interface DashboardInterface {
	settings: boolean,
	profile: boolean,
	appstore: boolean
}
//#endregion

//#region site configuration
export interface SiteConfigInterface {
	siteConfigReducer: {
		data: {
			clearLoginCache: boolean,
			themePreference: {
				setting: string
				mode: PaletteMode
			}
		}
	}
}

export interface SiteConfigDataInterface {
	data: {
		clearLoginCache: boolean
		themePreference: ThemePreferenceInterface
	}
}

export interface ThemePreferenceInterface {
	setting: string
	mode: PaletteMode
}
//#endregion