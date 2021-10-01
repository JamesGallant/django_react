import { createAsyncThunk, createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getUserData } from "../../api/authentication";

import type { RootState } from "../store";
import type { UserDataInterface } from "../../types/authentication";

interface userDataState {
    user: {
        stateStatus: string,
        data: UserDataInterface,
        error: {
			detail: string
		} | unknown
    }
}

interface userDataError {
    data: {
        detail: string
    }
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

export const getUser = createAsyncThunk(
	"users/getCurrentUser",
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
		[getUser.pending.type]: (state) => {
			state.user.stateStatus = "loading";
		}, 

		[getUser.fulfilled.type]: (state, action: PayloadAction<UserDataInterface>) => {
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
				error: {}
			};
		},
		[getUser.rejected.type]: (state, action: PayloadAction<userDataError>) => {
			state.user.stateStatus = "failed";
			state.user.error = action.payload;
		},
	}
});

export const selectUserReducer = (state: RootState): userDataState => state.userReducer;
export const selectUserData = (state: RootState): UserDataInterface => state.userReducer.user.data;
export const selectUserStateStatus = (state: RootState): string => state.userReducer.user.stateStatus;

export default userSlice.reducer;