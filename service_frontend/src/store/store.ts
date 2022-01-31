import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import users from "./slices/userSlice";
import siteConfiguration from "./slices/siteConfigurationSlice";
import registeredApps from "./slices/registeredAppsSlice";
import userOwnedApps from "./slices/userOwnedAppsSlice";
import configuration from "../utils/config";

// @TODO store encryption
const persistSiteConfig = {
	key: configuration["persistKey-siteConfiguraton"],
	storage,
	version: 1,
	// whitelist: [], // persist
	// blacklist: [] // don't persist
};

const reducer = combineReducers({
	siteConfiguration: persistReducer(persistSiteConfig, siteConfiguration),
	users: users,
	registeredApps: registeredApps,
	userOwnedApps: userOwnedApps
});

// this causes an extra tree
export const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch