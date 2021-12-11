import React, { FC, useState, useEffect } from "react";
import { Grid, Typography, Divider, Stack, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio,
	Checkbox, useTheme, useMediaQuery } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectSiteTheme, setThemeMode, setThemePreference } from "../../store/slices/siteConfigurationSlice";

import MediaCard from "../common/cards/MediaCard";
import darkmodeImage from "../../assets/images/darkmode.png";
import lightmodeImage from "../../assets/images/lightmode.png";

import type { ThemePreferenceInterface } from "../../types/store";

interface CardSelectThemeInterface {
	darkmode: boolean
	lightmode: boolean
}

const SettingsAppearance: FC = (): JSX.Element => {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const siteTheme: ThemePreferenceInterface = useAppSelector(selectSiteTheme);

	// TODO do we need to remove this?
	const prefersDarkMode: boolean = useMediaQuery("(prefers-color-scheme: dark)");
	const initialCardThemeValues: CardSelectThemeInterface = {
		darkmode: theme.palette.mode === "light" ? false : true,
		lightmode: theme.palette.mode === "light" ? true : false
	};
	
	const [themeValue, setThemeValue] = useState(siteTheme.setting);
	const [cardThemeValue, setCardThemeValue] = useState(initialCardThemeValues);
	const [isThemeDisabled, setThemeDisabled] = useState(themeValue === "SyncTheme" ? true : false);


	// useEffect(() => {
	// 	console.log(themeValue);
	// 	dispatch(setThemePreference(themeValue));
	// 	// dispatch(setThemeMode(cardThemeValue.darkmode === true ? "dark" : "light"));
	// },[themeValue]);

	const handleThemePreference = (event: React.ChangeEvent<HTMLInputElement>) => {
		// On syncTheme we need to check prefersDarkMode and dispatch this to the theme on the main component
		// initial card vals need to be on a listner to detect changes in theme.palette.mode 
		// On selectTheme we need to change the theme pallete mode also via dispatch to the main component

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

	const handleCardCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
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
		<div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="subtitle1"> <strong> Appearance settings</strong></Typography>
					<Divider/>
				</Grid>
				<Grid item xs={12} sx={{marginTop: 0.5}}>
					<Typography  variant="subtitle2"><strong>Theme preference</strong></Typography>
					<Stack spacing={1}>
						<Typography  
							variant="subtitle1" 
							paragraph 
							sx={{fontSize: 12}}
						>
							Choose how {process.env.REACT_APP_SITE_NAME} looks to you. Either select a theme or we can automatically
							sync it with your current system preference. 
						</Typography>
						{/* <Radio
							checked={themeValue === "SyncTheme"}
							onChange={handleThemePreference}
							value="SyncTheme"
							name="ThemeSettingToggle"
							inputProps={{ "aria-label": "SyncTheme" }}
						/>
						<Radio
							checked={themeValue === "SelectTheme"}
							onChange={handleThemePreference}
							value="SelectTheme"
							name="ThemeSettingToggle"
							inputProps={{ "aria-label": "SelectTheme" }}
						/> */}
						<FormControl component="fieldset">
							<FormLabel component="legend">Select preference</FormLabel>
							<RadioGroup
								row 
								aria-label="gender"
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
								cardContentElements={
									<Typography variant="body2" color="text.secondary">
									Example Text
									</Typography>
								}
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
								cardContentElements={
									<Typography variant="body2" color="text.secondary">
									Example Text
									</Typography>
								}
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
		</div>
	);
};

export default SettingsAppearance;