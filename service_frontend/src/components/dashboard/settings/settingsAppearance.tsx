import React, { FC, useState } from "react";
import { Grid, Typography, Divider, Stack, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio,
	Checkbox, useTheme, useMediaQuery, Box } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { selectSiteTheme, setThemeMode, setThemePreference } from "../../../store/slices/siteConfigurationSlice";

import MediaCard from "../../common/cards/MediaCard";
import darkmodeImage from "../../../assets/images/darkmode.png";
import lightmodeImage from "../../../assets/images/lightmode.png";
import configuration from "../../../utils/config";
import type { ThemePreferenceInterface } from "../../../types/siteConfigTypes";

interface CardSelectThemeInterface {
	darkmode: boolean
	lightmode: boolean
}

const SettingsAppearance: FC = (): JSX.Element => {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const prefersDarkMode: boolean = useMediaQuery("(prefers-color-scheme: dark)");
	const siteTheme: ThemePreferenceInterface = useAppSelector(selectSiteTheme);

	const initialCardThemeValues: CardSelectThemeInterface = {
		darkmode: theme.palette.mode === "light" ? false : true,
		lightmode: theme.palette.mode === "light" ? true : false
	};

	const [themeValue, setThemeValue] = useState(siteTheme.setting);
	const [cardThemeValue, setCardThemeValue] = useState(initialCardThemeValues);
	const [isThemeDisabled, setThemeDisabled] = useState(themeValue === "SyncTheme" ? true : false);

	const handleThemePreference = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const themePreference: string = event.target.value;
		setThemeValue(themePreference);
		if (themePreference === "SyncTheme") {
			setThemeDisabled(true);
			setCardThemeValue({
				darkmode: prefersDarkMode,
				lightmode: !prefersDarkMode
			});
			dispatch(setThemeMode(prefersDarkMode === true ? "dark" : "light"));
		} else {
			setThemeDisabled(false);
		}

		dispatch(setThemePreference(themePreference));
	};

	const handleCardCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, checked } = event.target;
		switch(name) {
		case "darkmode": {
			setCardThemeValue({
				darkmode: checked,
				lightmode: !checked
			});
			dispatch(setThemeMode("dark"));
			break;
		}
		case "lightmode": {
			setCardThemeValue({
				darkmode: !checked,
				lightmode: checked
			});
			dispatch(setThemeMode("light"));
			break;
		}
		default: {
			throw new Error(`The mode ${name} is not valid, options are (darkmode | lightmode)`);
		}
		}
	};

	return(
		<Box sx={{ width: "40vw" }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="subtitle1"> <strong>Appearance settings</strong></Typography>
					<Divider/>
				</Grid>
				<Grid item xs={12} sx={{ marginTop: 0.5 }}>
					<Typography  variant="subtitle2"><strong>Theme preference</strong></Typography>
					<Stack spacing={1}>
						<Typography  
							variant="subtitle1" 
							paragraph 
							sx={{ fontSize: 12 }}
						>
							Choose how { configuration["site-name"] } looks to you. Either select a theme or we can automatically
							sync it with your current system preference. 
						</Typography>
						<FormControl component="fieldset">
							<FormLabel component="legend">Select preference</FormLabel>
							<RadioGroup
								row 
								aria-label="themePreference"
								name="controlled-radio-buttons-group"
								value={themeValue}
								onChange={handleThemePreference}
							>
								<FormControlLabel value="SyncTheme" control={<Radio />} label="Sync" />
								<FormControlLabel value="SelectTheme" control={<Radio />} label="Select" />
							</RadioGroup>
						</FormControl>
						<Stack 
							direction="row"
							spacing={2}
							divider={<Divider orientation="vertical" flexItem />}
						>
							<MediaCard 
								cardSx={{ width: "15vw", opacity: isThemeDisabled === true ? 0.5 : 1 }}
								mediaHeight="140"
								mediaComponent="img"
								mediaSrc={lightmodeImage}
								mediaAlt="lightmode"
								cardActionElements={
									<FormControlLabel 
										label="Lightmode"
										control={
											<Checkbox
												checked={cardThemeValue.lightmode}
												disabled={isThemeDisabled}
												onChange={handleCardCheckbox}
												name="lightmode"
												inputProps={{ "aria-label": "thememode" }}
											/>
										}
									/>
								}
							/>
							<MediaCard 
								cardSx={{ width: "15vw", opacity: isThemeDisabled === true ? 0.5 : 1 }}
								mediaHeight="140"
								mediaComponent="img"
								mediaSrc={darkmodeImage}
								mediaAlt="darkmode"
								cardActionElements={
									<FormControlLabel 
										label="Darkmode"
										control={
											<Checkbox
												checked={cardThemeValue.darkmode}
												disabled={isThemeDisabled}
												onChange={handleCardCheckbox}
												name="darkmode"
												inputProps={{ "aria-label": "thememode" }}
											/>
										}
									/>
								}
							/>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SettingsAppearance;