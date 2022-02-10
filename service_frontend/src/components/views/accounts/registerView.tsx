// react
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// material ui
import { Button, CssBaseline, Link, Grid, Box, Typography, Container } from "@mui/material";
import { CentredSubmitFormRoot } from "../../../utils/commonStyles";

// third party
import parsePhoneNumber from "libphonenumber-js";

// own
import Copyright from "../../common/helper/copyrightComponent";
import TextField from "../../common/formFields/TextFieldComponent";
import PasswordField from "../../common/formFields/passwordComponent";
import CountrySelect from "../../common/formFields/countryComponent";
import FlashError from "../../common/helper/flashErrors";
import configuration from "../../../utils/config";

import { postRegisterUser } from "../../../api/authenticationAPI";
import { AxiosResponse } from "axios";

import type { UserDataInterface } from "../../../types/authentication";

const { Root, classes} = CentredSubmitFormRoot("RegisterView");

//#region types
interface FormTypes {
    firstName: string,
    lastName: string,
    country: string,
    mobileNumber: string,
    email: string,
    password: string
}

const initialVals: FormTypes = {
	firstName: "",
	lastName: "",
	country: "",
	mobileNumber: "",
	email: "",
	password: ""
};

interface ErrMessageTypes {
    firstName: string[],
    lastName: string[],
    email: string[], 
    mobile: string[],
    country: string[],
    password: string[],
}

const initialErrs: ErrMessageTypes = {
	firstName: [""],
	lastName: [""],
	email: [""], 
	mobile: [""],
	country: [""],
	password: [""],

};
//#endregion

const RegisterView: React.FC = (): JSX.Element => {
/**
 *@Description component signs up a user by submitting a post request to the authentication server with the required fields. The mobile_number 
 * number must be edited to reflect the correct country by use of the country selector. 
 *
 *@Resource https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
 *@Resource https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-create
 */


	const navigate = useNavigate();

	const [formValues, setFormValues] = useState(initialVals);
	const [countryCode, setCountryCode] = useState("");
	const [errorMessage, setErrorMessage] = useState(initialErrs);
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
   
		setFormValues({
			...formValues,
			[name]: value,
		});
	};

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

	const  submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFlashError(false);
		setFlashErrorMessage("");
		const country: any = countryCode;
		const parsedPhoneNumber = parsePhoneNumber(formValues.mobileNumber, country);
		const parsedEmail = formValues.email.toLowerCase();
		let phonenumber = formValues.mobileNumber;

		if (parsedPhoneNumber) {
			phonenumber = parsedPhoneNumber.number.toString();
		} 
    
		const userData: UserDataInterface = {
			first_name: formValues.firstName,
			last_name: formValues.lastName,
			mobile_number: phonenumber,
			email: parsedEmail,
			country: formValues.country,
			password: formValues.password,
			re_password: formValues.password
		};
    
		const registerNewAccountResponse: AxiosResponse = await postRegisterUser(userData);
		const statusCode: number = registerNewAccountResponse.status;
		const responseData = registerNewAccountResponse.data;
		switch(statusCode) {
		case 201:
			//account creation successfull
			navigate(configuration["url-accountCreated"], {
				state: {
					email: parsedEmail,
					firstName: formValues.firstName,
				}
			});
			break;
		case 401:
			// has modheaders
			setFlashError(true);
			setFlashErrorMessage("Unauthorised token detected");
			break;
		case 400:
			// account creation failed
			setFlashError(true);
			setFlashErrorMessage("Account creation failed");
			setErrorMessage({
				firstName: typeof(responseData?.first_name) === "undefined" ? [""]: responseData?.first_name,
				lastName: typeof(responseData?.last_name) === "undefined" ? [""]:  responseData?.last_name,
				email: typeof(responseData?.email) === "undefined" ? [""]: responseData?.email,
				mobile: typeof(responseData?.mobile_number) === "undefined" ? [""]: responseData?.mobile_number,
				country: typeof(responseData?.country) === "undefined" ? [""]: responseData?.country,
				password: typeof(responseData?.password) === "undefined" ? [""]: responseData?.password,
			});
			break;

		default:
			throw new Error("Status code invalid, should be 400 or 201. See https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-create");
		}
	};

	return (
		<Root className={classes.root} >
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box boxShadow={5} className={classes.paper}>
					<form className={classes.form} noValidate={true} onSubmit= { submit }>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="h5" align="center">
									<strong>Create your {process.env.REACT_APP_SITE_NAME} account</strong>
								</Typography>
							</Grid>
							<Grid item xs = {12}>
								<FlashError 
									message={flashErrorMessage}
									display={flashError}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									name="firstName"
									id="fname"
									label="First Name"
									fullWidth
									required
									value={ formValues.firstName }
									onChange={ handleChange }
									errorMessage={ errorMessage.firstName }
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lname"
									name="lastName"
									label="Last Name"
									value={ formValues.lastName }
									onChange={ handleChange }
									errorMessage={ errorMessage.lastName }
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<CountrySelect 
									onChange={ handleCountryData } 
									required
									errorMessage = { errorMessage.country }
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="mobileNumber"
									name="mobileNumber"
									label="mobile number"
									value={ formValues.mobileNumber }
									onChange={ handleChange }
									errorMessage={ errorMessage.mobile }
								/>
							</Grid>
							<Grid item xs={12} >
								<TextField
									required
									fullWidth
									id="email"
									label="Email"
									name="email"
									value={ formValues.email }
									onChange={ handleChange }
									errorMessage={ errorMessage.email }
                    
								/>
							</Grid>
							<Grid item xs={12} >
								<PasswordField
									id="password"
									showTooltip= {true}
									value={ formValues.password }
									errorMessage={ errorMessage.password }
									onChange={ handleChange }/>
							</Grid>
							<Grid item xs={12}>
								<Button
									fullWidth
									variant="contained"
									color="primary"
									type="submit"
									className={classes.submit}
								>
									Register
								</Button>
							</Grid>
							<Grid item  xs={12}>
								<Link href={configuration["url-login"]} variant="body2">
									log in instead
								</Link>
							</Grid>
						</Grid>
					</form>
				</Box>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</Root>
	);
};

export default RegisterView;