import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getRegisteredApps } from "../../api/applicationAPI";
import type { RootState } from "../store";
import type { AppStateInterface} from "../../types/store";
import type { RegisterAppPayloadInterface, AppDataUnion } from "../../types/applicationTypes";

const initialState: AppStateInterface = {
	appReducer: {
		stateStatus: "idle",
		data: {
			count: 0,
			next: null,
			previous: null,
			results: null
		},
		error: {}
	},
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

export const appSlice: Slice = createSlice({
	name: "apps",
	initialState,
	reducers: {},
	extraReducers: {
		[getRegisteredApp.pending.type]: (state) => {
			state.appReducer.stateStatus = "pending";
		},
		[getRegisteredApp.fulfilled.type]: (state, action: PayloadAction<AppDataUnion>) => {
			console.log(action);
			if (action.payload.detail) {
				state.appReducer.stateStatus = "failed";
				state.appReducer.error = action.payload;
			} else {
				state.appReducer.stateStatus = "fulfilled";
				state.appReducer.data = {
					count: action.payload.count,
					next: action.payload.next,
					previous: action.payload.previous,
					results: action.payload.results,
				};
			}

		},
		[getRegisteredApp.rejected.type]: (state, action: PayloadAction<any>) => {
			state.appReducer.stateStatus = "failed";
			state.appReducer.error = action.payload;
		}
	}
});

export const selectAppStateStatus = (state: RootState): string => state.apps.appReducer.data;
export const selectAppState = (state: RootState): AppStateInterface => state.apps;
export const selectAppData = (state: RootState): AppDataUnion => state.apps.appReducer.data;

export default appSlice.reducer;

