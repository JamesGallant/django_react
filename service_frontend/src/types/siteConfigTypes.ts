import type { PaletteMode } from "@mui/material";

export interface SiteConfigDataInterface {
	data: {
		clearLoginCache: boolean
		themePreference: ThemePreferenceInterface
	}
}

export interface ThemePreferenceInterface {
	setting: string
	mode: PaletteMode
}