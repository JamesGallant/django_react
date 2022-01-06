import type { UserDataInterface } from "./authentication";
import type { AppDataMixin } from "./applicationTypes";
import type { ThemePreferenceInterface } from "./siteConfigTypes"; 
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

//#region site configuration
export interface SiteConfigInterface {
	siteConfigReducer: {
		data: {
			clearLoginCache: boolean,
			themePreference: ThemePreferenceInterface
		}
	}
}
//#endregion

//#region apps

export interface AppStateInterface {
	appReducer: {
		stateStatus: string
		data: AppDataMixin
		error: any
	}
}

//#endregion