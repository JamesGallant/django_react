import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getRegisteredApps } from "../../api/applicationAPI";
import type { RootState } from "../store";
import type { RegisteredAppStateInterface } from "../../types/store";
import type { RegisterAppPayloadInterface, AppDataUnion } from "../../types/applicationTypes";

const initialState: RegisteredAppStateInterface = {
	registeredAppsReducer: {
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

export const getRegisteredApp = createAsyncThunk(
	"apps/getRegisteredApps",
	async (payload: RegisterAppPayloadInterface) => {
		if (payload.authToken === "" || payload.authToken === null) {
			throw new Error("Invalid authentication token provided");
		}

		const response: AxiosResponse = await getRegisteredApps(payload.authToken, payload.url);
		return response.data;
	}
);

export const registeredAppSlice: Slice = createSlice({
	name: "registeredApps",
	initialState,
	reducers: {},
	extraReducers: {
		[getRegisteredApp.pending.type]: (state) => {
			state.registeredAppsReducer.stateStatus = "pending";
		},
		[getRegisteredApp.fulfilled.type]: (state, action: PayloadAction<AppDataUnion>) => {
			if (action.payload.detail) {
				state.registeredAppsReducer.stateStatus = "failed";
				state.registeredAppsReducer.error = action.payload;
			} else {
				state.registeredAppsReducer.stateStatus = "fulfilled";
				state.registeredAppsReducer.data = {
					count: action.payload.count,
					next: action.payload.next,
					previous: action.payload.previous,
					results: action.payload.results,
				};
			}

		},
		[getRegisteredApp.rejected.type]: (state, action: PayloadAction<unknown>) => {
			state.registeredAppsReducer.stateStatus = "failed";
			state.registeredAppsReducer.error = action.payload;
		}
	}
});

export const selectAppStateStatus = (state: RootState): string => state.registeredApps.registeredAppsReducer.stateStatus;
export const selectAppState = (state: RootState): RegisteredAppStateInterface => state.registeredApps;
export const selectAppData = (state: RootState): AppDataUnion => state.registeredApps.registeredAppsReducer.data;

export default registeredAppSlice.reducer;

