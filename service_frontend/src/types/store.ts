import type { UserDataInterface } from "./authentication";
import type { AppDataMixin, userAppDataUnion } from "./applicationTypes";
import type { ThemePreferenceInterface } from "./siteConfigTypes"; 
import type { PurchaseDialogData } from "./purchaseDialogTypes";
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
			themePreference: ThemePreferenceInterface,
		}
	}
}
//#endregion

//#region registeredApps

export interface RegisteredAppStateInterface {
	registeredAppsReducer: {
		stateStatus: string
		data: AppDataMixin
		error: any
	}
}

//#endregion

//#region userOwnedApps
export interface UserOwnedAppsStateInterface {
	userAppsReducer: {
		stateStatus: string,
		data: userAppDataUnion,
		error: any
	}
}
//#endregion

//#region purchaseDialog
export interface PurchaseDialogStateInterface {
	purchaseDialogReducer: PurchaseDialogData
}

//#endregion