import React, { FC, useState } from "react";
import { parsePhoneNumber } from "libphonenumber-js";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectUserData, getUser } from "../../store/slices/userSlice";

import { Grid, Box, Typography, Divider, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import TextField from "../common/formFields/TextFieldComponent";
import CountrySelect from "../common/formFields/countryComponent";
import FlashError from "../common/helper/flashErrors";

import { putRegisterUser } from "../../api/authentication";
import CookieHandler from "../../modules/cookies";
import type { UserDataInterface, UserPutInterface } from "../../types/authentication";
import { AxiosResponse } from "axios";

interface ErrMessageTypes {
    first_name: string[],
    last_name: string[],
    email: string[], 
    mobile_number: string[],
    country: string[],
}
const SettingsProfile: FC = (): JSX.Element => {
	const user: UserDataInterface = useAppSelector(selectUserData);

	const initialValues: UserPutInterface = {
		first_name: user.first_name,
		last_name: user.last_name,
		country: user.country,
		mobile_number: user.mobile_number,
	};

	const initialErrs: ErrMessageTypes = {
		first_name: [""],
		last_name: [""],
		email: [""], 
		mobile_number: [""],
		country: [""],
	};
	
	const dispatch = useAppDispatch();
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);
	const [formValues, setFormValues] = useState(initialValues);
	const [countryCode, setCountryCode] = useState("");
	const [errorMessage, setErrorMessage] = useState(initialErrs);
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

		setFormValues({
			...formValues,
			[name]: value,
		});
		setErrorMessage({
			...errorMessage,
			[name]: [""]
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
		const response: AxiosResponse = await putRegisterUser(updatedProfileData, authToken);
		switch(response.status) {
		case 200: {
			const getUserData = await dispatch(getUser(authToken));
			if (getUserData.meta.requestStatus === "rejected" || getUserData.payload.detail) {
				setFlashError(true);
				setFlashErrorMessage("Error fetching user data, try again");
			}
			break;
		}
		case 401: {
			setFlashError(true);
			setFlashErrorMessage("Unauthorised token detected");
			break;
		}
		case 400: {
			setErrorMessage({
				first_name: typeof(response.data?.first_name) === "undefined" ? [""]: response.data?.first_name,
				last_name: typeof(response.data?.last_name) === "undefined" ? [""]:  response.data?.last_name,
				email: typeof(response.data?.email) === "undefined" ? [""]: response.data?.email,
				mobile_number: typeof(response.data?.mobile_number) === "undefined" ? [""]: response.data?.mobile_number,
				country: typeof(response.data?.country) === "undefined" ? [""]: response.data?.country,
			});
			break;
		}
		default: {
			throw new Error("Status code invalid, should be 400 or 200");
		}
		}
		setLoading(false);
	};

	return(
		<Box sx={{width: "30vw"}}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Stack direction="row" justifyContent="space-between">
						<Typography gutterBottom variant="subtitle1"> <strong> Update Profile</strong></Typography>
						<LoadingButton
							onClick={ submit }
							endIcon={<SaveIcon />}
							loading={loading}
							size="small"
							sx={{width: "200px"}}
							loadingPosition="end"
							variant="contained"
						>
							Update
						</LoadingButton>
					</Stack>
					<Divider sx={{marginTop: "2vh"}}/>
				</Grid>
				<Grid item xs = {12}>
					<FlashError 
						message={flashErrorMessage}
						display={flashError}
					/>
				</Grid>
				<Grid item xs={12}>
					<Typography  variant="subtitle2"> <strong>Change your name</strong></Typography>
				</Grid>
				<Grid item xs={6}>
					<TextField 
						name="first_name"
						id="fname"
						sx={{width: "15vw"}}
						label="First name"
						errorMessage={errorMessage.first_name}
						onChange={handleFormInput}
						value={ formValues.first_name }
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField 
						name="last_name"
						id="lname"
						sx={{width: "15vw"}}
						label="Last name"
						onChange={handleFormInput}
						value={ formValues.last_name }
						errorMessage={errorMessage.last_name}
					/>
				</Grid>
				<Grid item xs={6}>
					<Typography gutterBottom variant="subtitle2"> <strong>Update your country</strong></Typography>
					<CountrySelect 
						width={"15vw"}
						onChange={ handleCountryData} 
						errorMessage = { errorMessage.country }
					/>
					<Typography variant="subtitle2">Your country is currently set to {user.country}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography gutterBottom variant="subtitle2"> <strong>Update your mobile number</strong></Typography>
					<TextField 
						fullWidth
						sx={{width: "15vw"}}
						id="mobile_number"
						name="mobile_number"
						label="mobile number"
						onChange={handleFormInput}
						value={ formValues.mobile_number }
						errorMessage={ errorMessage.mobile_number }
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SettingsProfile;