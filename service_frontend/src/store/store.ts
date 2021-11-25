import { configureStore } from "@reduxjs/toolkit";
import users from "./slices/userSlice";
import views from "./slices/viewSlice";
import siteConfiguration from "./slices/siteConfigurationSlice";

export const store = configureStore({
	reducer: {
		users,
		views,
		siteConfiguration,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch