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
	card_description: string
	full_description: string
	base_app_description: string
	premium_description: string
	base_cost: number
	premium_cost: number
	has_premium_service: boolean
	url: string
	image_path: string
	cost: number
	disabled: boolean
}