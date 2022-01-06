import type { ApiErrInterface } from "./types";

export interface OwnedAppInterface {
	id: number;
	activation_date: string;
	expiration_date: string;
	app: number;
	user: number
}

export interface RegisterAppPayloadInterface  {
	authToken: string;
	url: string
}

export type AppDataUnion = AppPagedInterface & ApiErrInterface
export type AppDataMixin = AppPagedInterface | ApiErrInterface

export interface AppPagedInterface {
	count: number
	next: number | null
	previous: number | null
	results: Array<AppDataInterface> | null
}

export interface AppDataInterface {
	id: number
	name: string
	description: string
	url: string
	image_path: string
}