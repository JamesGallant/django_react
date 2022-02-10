import { subscriptionOptions } from "./applicationTypes";


export interface subscriptionCardSelection {
	demo: boolean
	basic: boolean
	premium: boolean
}

export interface configurationInterface {
	duration: number
	durationText: string
	multiplier: number
	discountInfo: string
}

export interface PurchaseDialogData {
	data: {
		steps: Array<string>
		activeStep: number
		appID: number
		selectedSubscription: subscriptionOptions
		cardSelection: subscriptionCardSelection
		configuration: configurationInterface
	}
}