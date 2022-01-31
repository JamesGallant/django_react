import type { ApiErrInterface, BasePagedInterface } from "./types";

export type subscriptionOptions = "DEMO" | "BASIC" | "PREMIUM" | "DEMO|BASIC|PREMIUM" | "DEMO|BASIC" | "BASIC|PREMIUM" | "UNDEFINED"
export type AppDataUnion = AppPagedInterface & ApiErrInterface;
export type AppDataMixin = AppPagedInterface | ApiErrInterface;
export type userAppDataUnion = UserOwnedAppsPagedInterface & ApiErrInterface;
export type userAppDataMixin = UserOwnedAppsPagedInterface | ApiErrInterface;
export type ownedAppAndErrorUnion = OwnedAppInterface & ApiErrInterface;

interface BasePayloadInterface {
	authToken: string
}

export interface OwnedAppInterface {
	id?: number;
	activation_date?: string;
	expiration_date: string;
	app: number;
	user: number,
	is_expired?: boolean
}

export interface linkAppPayloadInterface extends BasePayloadInterface {
	data: OwnedAppInterface
}

export interface RegisterAppPayloadInterface extends BasePayloadInterface {
	url: string
}

export interface PatchExpirationDateInterface extends BasePayloadInterface {
	authToken: string
	id: number
	expirationDate: string
}

export interface AppDataInterface {
	id: number
	name: string
	card_description: string
	full_description: string
	demo_app_description: string
	basic_app_description: string
	premium_app_description: string
	basic_cost_currency: string
	premium_cost_currency: string
	basic_cost: number
	premium_cost: number
	subscription_type: subscriptionOptions
	url: string
	disabled: boolean
}

export interface AppPagedInterface extends BasePagedInterface {
	results: Array<AppDataInterface> | undefined
}

export interface UserOwnedAppsPagedInterface extends BasePagedInterface {
	results: Array<OwnedAppInterface> | undefined
}