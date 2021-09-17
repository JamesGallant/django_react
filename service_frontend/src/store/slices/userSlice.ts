import { createAsyncThunk, createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { getUserData } from "../../api/authentication";

import type { RootState } from "../store";
import type { UserData } from "../../types/authentication";

interface userDataState {
    user: {
        stateStatus: string,
        data: UserData,
        error: {}
    }
};

interface userDataError {
    data: {
        detail: string
    }
};

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
    'users/getCurrentUser',
    async (authToken: string, thunkAPI) => {
        if (authToken === "" || authToken === null) {
            throw new Error("Invalid authentication token provided")
        }
        const response: AxiosResponse = await getUserData(authToken)
        return response.data
    }
  )
export const userSlice = createSlice({
        name: 'userData',
        initialState, 
        reducers: {},
        extraReducers: {
            [getUser.pending.type]: (state, action: PayloadAction) => {
                state.user.stateStatus = "loading"
            }, 

            [getUser.fulfilled.type]: (state, action: PayloadAction<UserData>) => {
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
                state.user.error = action.payload.data;
            },
        }
});

export const selectUserReducer = (state: RootState) => state.userReducer.user
export const selectUserData = (state: RootState) => state.userReducer.user.data

export default userSlice.reducer;