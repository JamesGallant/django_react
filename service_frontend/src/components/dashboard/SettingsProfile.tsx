import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserData } from "../../store/slices/userSlice";

import { Grid, Box, Typography, Divider, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import TextField from "../common/formFields/TextFieldComponent";
import CountrySelect from "../common/formFields/countryComponent";
import type { UserDataInterface } from "../../types/authentication";

interface formTypes {
	firstName: string,
	lastName: string,
	country: string,
    mobileNumber: string,

}

const SettingsProfile: FC = (): JSX.Element => {
	const user: UserDataInterface = useAppSelector(selectUserData);

	function handleClick() {
		console.log("clicked");
	}

	return(
		<Box sx={{maxWidth: "40%"}}>
			<Grid container spacing={1.5}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="subtitle1"> <strong> Update Profile</strong></Typography>
					<Divider/>
				</Grid>
				<Grid item xs={12} sx={{marginTop: 2}}>
					<Typography  variant="subtitle2"> <strong>Change your name</strong></Typography>
				</Grid>
				<Grid item xs={6}>
					<TextField 
						name="firstName"
						id="fname"
						label="First name"
						value={ user.first_name }
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField 
						name="lastName"
						id="lname"
						label="Last name"
						value={ user.last_name }
					/>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle2"> <strong>Update your country</strong></Typography>
				</Grid>
				<Grid item xs={12}>
					<CountrySelect 
						onChange={ console.log("hello")} 
						required
					/>
					<Typography variant="subtitle2">Your country is currently set to {user.country}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography gutterBottom variant="subtitle2"> <strong>Update your mobile number</strong></Typography>
				</Grid>
				<Grid item xs={6}>
					<TextField 
						required
						fullWidth
						id="mobileNumber"
						name="mobileNumber"
						label="mobile number"
						value={ user.mobile_number }
					/>
				</Grid>
				<Grid item xs={12}>
					<LoadingButton
						onClick={handleClick}
						endIcon={<SaveIcon />}
						loading={false}
						size="large"
						loadingPosition="end"
						variant="contained"
					>
						Update
					</LoadingButton>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SettingsProfile;