import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getUserData } from "../../api/authentication";

import type { RootState } from "../store";
import type { UserDataInterface } from "../../types/authentication";

interface stateError {
	message: string,
	name: string,
	stack: string
}

interface userDataState {
    user: {
        stateStatus: string,
        data: UserDataInterface,
        error: stateError | unknown
    }
}

interface UserDataError {
	detail: string
}

const initialState: userDataState = {
	user: {
		stateStatus: "idle",
		data: {
			id: null,
			first_name: null,
			last_name: null,
			country: null,
			mobile_number: null,
			email: null
		},
		error: {}
	}
};

export const setUser = createAsyncThunk(
	"users/setCurrentUser",
	async (authToken: string) => {
		if (authToken === "" || authToken === null) {
			throw new Error("Invalid authentication token provided");
		}
		const response: AxiosResponse = await getUserData(authToken);
		return response.data;
	}
);

export const userSlice = createSlice({
	name: "userData",
	initialState, 
	reducers: {},
	extraReducers: {
		[setUser.pending.type]: (state) => {
			state.user.stateStatus = "loading";
		}, 

		[setUser.fulfilled.type]: (state, action: PayloadAction<UserDataInterface>) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			/**@ts-ignore */
			state.user = {
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
		[setUser.rejected.type]: (state, action: PayloadAction<any>) => {
			state.user = {
				stateStatus: "failed",
				data: {
					id: null,
					first_name: null,
					last_name: null,
					email: null,
					country: null,
					mobile_number: null,
				},
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				/**@ts-ignore */
				error: action.error
			};
		},
	}
});

export const selectUserReducer = (state: RootState): userDataState => state.userReducer;
export const selectUserData = (state: RootState): UserDataInterface => state.userReducer.user.data;
export const selectUserStateStatus = (state: RootState): string => state.userReducer.user.stateStatus;

export default userSlice.reducer;