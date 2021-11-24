import React, { FC, useState } from "react";
import { parsePhoneNumber } from "libphonenumber-js";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectUserData, getUser } from "../../store/slices/userSlice";

import { Grid, Box, Typography, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import TextField from "../common/formFields/TextFieldComponent";
import CountrySelect from "../common/formFields/countryComponent";
import FlashError from "../common/helper/flashErrors";

import { putRegisterUser } from "../../api/authentication";
import CookieHandler from "../../modules/cookies";
import type { UserDataInterface, UserPutInterface, UserPutResponseInterface } from "../../types/authentication";

const SettingsProfile: FC = (): JSX.Element => {
	const user: UserDataInterface = useAppSelector(selectUserData);
	const dispatch = useAppDispatch();
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);

	const initialValues: UserPutInterface = {
		first_name: user.first_name,
		last_name: user.last_name,
		country: user.country,
		mobile_number: user.mobile_number,
	};

	const [formValues, setFormValues] = useState(initialValues);
	const [countryCode, setCountryCode] = useState("");
	const [loading, setLoading] = useState(false);

	const handleCountryData = (event: React.ChangeEvent<HTMLInputElement>, value: {code: string, label: string, phone: string}) => {

		const label = value && value.label; 
		const code = value && value.code;
		if (label === null) {
			setCountryCode("");
			setFormValues({
				...formValues,
				country: "",
			});

		} else {
			setCountryCode(code);
			setFormValues({
				...formValues,
				country: label,
			});
		}
	};

	const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		console.log(name, value);
		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	const submit = async (): Promise<void> => {
		setLoading(true);
		setFlashError(false);
		
		const cookies: CookieHandler = new CookieHandler();
		const country: any = countryCode;
		let phonenumber: any = formValues.mobile_number;

		const parsedPhoneNumber = parsePhoneNumber(phonenumber, country);
		
		if (parsedPhoneNumber) {
			phonenumber = parsedPhoneNumber.number.toString();
		} 
    
		const updatedProfileData: UserPutInterface = {
			first_name: formValues.first_name,
			last_name: formValues.last_name,
			mobile_number: phonenumber,
			country: formValues.country,
		};

		const authToken: string = cookies.getCookie("authToken");
		const response: UserPutResponseInterface = await putRegisterUser(updatedProfileData, authToken);
		if (response.status === 200) {
			const getUserData = await dispatch(getUser(authToken));
			if (getUserData.meta.requestStatus === "rejected" || getUserData.payload.detail) {
				setFlashError(true);
				setFlashErrorMessage("Error fetching user data, try again");
			}
		} else {
			setFlashError(true);
			setFlashErrorMessage(response.data.detail);
		}
		setLoading(false);
	};

	return(
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography gutterBottom variant="subtitle1"> <strong> Update Profile</strong></Typography>
				<Divider/>
			</Grid>
			<Grid item xs = {12}>
				<FlashError 
					message={flashErrorMessage}
					display={flashError}
				/>
			</Grid>
			<Grid item xs={12} sx={{marginTop: 1}}>
				<Typography  variant="subtitle2"> <strong>Change your name</strong></Typography>
			</Grid>
			<Grid item xs={6}>
				<TextField 
					name="first_name"
					id="fname"
					label="First name"
					onChange={handleFormInput}
					value={ formValues.first_name }
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField 
					name="last_name"
					id="lname"
					label="Last name"
					onChange={handleFormInput}
					value={ formValues.last_name }
				/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="subtitle2"> <strong>Update your country</strong></Typography>
			</Grid>
			<Grid item xs={12}>
				<CountrySelect 
					onChange={ handleCountryData} 
				/>
				<Typography variant="subtitle2">Your country is currently set to {user.country}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography gutterBottom variant="subtitle2"> <strong>Update your mobile number</strong></Typography>
			</Grid>
			<Grid item xs={6}>
				<TextField 
					fullWidth
					sx={{width: "15vw"}}
					id="mobile_number"
					name="mobile_number"
					label="mobile number"
					onChange={handleFormInput}
					value={ formValues.mobile_number }
				/>
			</Grid>
			<Grid item xs={12}>
				<LoadingButton
					onClick={ submit }
					endIcon={<SaveIcon />}
					loading={loading}
					size="medium"
					sx={{width: "15vw"}}
					loadingPosition="end"
					variant="contained"
				>
				Update
				</LoadingButton>
			</Grid>
		</Grid>
	);
};

export default SettingsProfile;