import type { UserDataInterface } from "./authentication";

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