import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getUserData } from "../../api/authenticationAPI";

import type { RootState } from "../store";
import type { UserDataInterface } from "../../types/authentication";
import type { UserStateInterface } from "../../types/store";

const initialState: UserStateInterface = {
	userReducer: {
		stateStatus: "idle",
		data: {
			id: null,
			first_name: "",
			last_name: "",
			country: "",
			mobile_number: "",
			email: ""
		},
		error: {}
	}
};

export const getUser = createAsyncThunk(
	"users/getUser",
	async (authToken: string) => {
		if (authToken === "" || authToken === null) {
			throw new Error("Invalid authentication token provided");
		}
		const response: AxiosResponse = await getUserData(authToken);
		return response.data;
	}
);

export const userSlice: Slice<UserStateInterface> = createSlice({
	name: "userData",
	initialState, 
	reducers: {

	},
	extraReducers: {
		[getUser.pending.type]: (state) => {
			state.userReducer.stateStatus = "loading";
		}, 
		[getUser.fulfilled.type]: (state, action: PayloadAction<UserDataInterface>) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			/**@ts-ignore */
			state.userReducer = {
				stateStatus: "success",
				data: {
					id: action.payload.id,
					first_name: action.payload.first_name,
					last_name: action.payload.last_name,
					email: action.payload.email,
					country: action.payload.country,
					mobile_number: action.payload.mobile_number,
				},
				error: {},
			};
		},
		[getUser.rejected.type]: (state, action: PayloadAction<any>) => {
			state.userReducer.stateStatus = "failed";
		},
	}
});

export const selectState = (state: RootState): UserStateInterface => state.users;
export const selectUserData = (state: RootState): UserDataInterface => state.users.userReducer.data;
export const selectUserStateStatus = (state: RootState): string => state.users.userReducer.stateStatus;

export default userSlice.reducer;