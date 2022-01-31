import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { linkAppToUser, getOwnedApps, patchOwnedAppExpirationDate } from "../../api/applicationAPI";

import type { UserOwnedAppsStateInterface } from "../../types/store";
import type {  linkAppPayloadInterface, userAppDataUnion, ownedAppAndErrorUnion, UserOwnedAppsPagedInterface, 
	PatchExpirationDateInterface } from "../../types/applicationTypes";
import type { RootState } from "../store";

const initialState: UserOwnedAppsStateInterface = {
	userAppsReducer: {
		stateStatus: "idle",
		data: {
			count: 0,
			next: null,
			previous: null,
			results: undefined
		},
		error: {}
	}
};

export const linkApp = createAsyncThunk(
	"apps/linkAppsToUser",
	async (payload: linkAppPayloadInterface) => {
		if (payload.authToken === "") {
			throw new Error("Invalid authentication token provided");
		}
		const response: AxiosResponse = await linkAppToUser(payload.authToken, payload.data);
		return response.data;
	}
);

export const updateAppExpirationDate = createAsyncThunk(
	"apps/updateAppExpiration",
	async (payload: PatchExpirationDateInterface) => {
		const response: AxiosResponse = await patchOwnedAppExpirationDate(payload.authToken, payload.id, payload.expirationDate);
		return response.data;
	}
);

export const getUserApps = createAsyncThunk(
	"apps/getOwnedApps",
	async (authToken: string) => {
		const response: AxiosResponse = await getOwnedApps(authToken);
		return response.data;
	}
);

export const userOwnedAppsSlice: Slice = createSlice({
	name: "userOwnedApps",
	initialState,
	reducers: {},
	extraReducers: {
		[updateAppExpirationDate.pending.type]: (state) => {
			state.userAppsReducer.stateStatus = "pending";
		},
		[updateAppExpirationDate.fulfilled.type]: (state,  action: PayloadAction<ownedAppAndErrorUnion>) => {
			if (action.payload.detail || action.payload.message || action.payload.non_field_errors) {
				state.userAppsReducer.stateStatus = "failed";
				state.userAppsReducer.error = action.payload;
			} else {
				// https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
				state.userAppsReducer.stateStatus = "fullfilled";
				state.userAppsReducer.data.results = state.userAppsReducer.data.results?.map((app) => {
					if (app.id === action.payload.id) {
						return action.payload;
					}
					return app;
				});
			}
		},
		[updateAppExpirationDate.rejected.type]: (state, action: PayloadAction<unknown>) => {
			state.userAppsReducer.stateStatus = "failed";
			state.userAppsReducer.error = action.payload;
		},
		[linkApp.pending.type]: (state) => {
			state.userAppsReducer.stateStatus = "pending";
		},
		[linkApp.fulfilled.type]: (state,  action: PayloadAction<ownedAppAndErrorUnion>) => {
			if (action.payload.detail || action.payload.message || action.payload.non_field_errors) {
				state.userAppsReducer.stateStatus = "failed";
				state.userAppsReducer.error = action.payload;
			} else {
				state.userAppsReducer.stateStatus = "fullfilled";
			}
	
		},
		[linkApp.rejected.type]: (state, action: PayloadAction<unknown>) => {
			state.userAppsReducer.stateStatus = "failed";
			state.userAppsReducer.error = action.payload;
		},
		[getUserApps.pending.type]: (state) => {
			state.userAppsReducer.stateStatus = "pending";
		},
		[getUserApps.fulfilled.type]: (state,  action: PayloadAction<userAppDataUnion>) => {
			if (action.payload.detail || action.payload.message || action.payload.non_field_errors) {
				state.userAppsReducer.stateStatus = "failed";
				state.userAppsReducer.error = action.payload;
			} else {
				state.userAppsReducer.stateStatus = "fullfilled";
				state.userAppsReducer.data = action.payload;
			}
	
		},
		[getUserApps.rejected.type]: (state, action: PayloadAction<unknown>) => {
			state.userAppsReducer.stateStatus = "failed";
			state.userAppsReducer.error = action.payload;
		}
	}
});

export const selectUserApps = (state: RootState): UserOwnedAppsPagedInterface => state.userOwnedApps.userAppsReducer.data;
export default userOwnedAppsSlice.reducer;