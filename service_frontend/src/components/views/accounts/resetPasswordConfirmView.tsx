import React, { FC, useState } from "react";
import { useParams, useHistory } from "react-router";
import { AxiosResponse } from "axios";

import { Grid, Container, CssBaseline, Typography, Button, Link, Box } from "@mui/material";
import { CentredSubmitFormRoot } from "../../../utils/commonStyles";

import { resetPasswordConfirm } from "../../../api/authenticationAPI";
import configuration from "../../../utils/config";
import { logout } from "../../../modules/authentication";

import PasswordField from "../../common/formFields/passwordComponent";
import FlashError from "../../common/helper/flashErrors";
import Copyright from "../../common/helper/copyrightComponent";

import type { UrlAuthTokenTypes } from "../../../types/authentication";


interface initialValInterface {
	new_password: string,
	re_new_password: string
}

interface initialErrInterface {
	new_password: string[],
	re_new_password: string[]
}

const initalValues: initialValInterface = {
	new_password: "",
	re_new_password: "",
};

const initialErrors: initialErrInterface = {
	new_password: [""],
	re_new_password: [""]
};

const ResetPasswordConfirm: FC = (): JSX.Element => {

	const history = useHistory();
	const { Root, classes} = CentredSubmitFormRoot("ResetPasswordConfirm");

	const {uid, token} = useParams<UrlAuthTokenTypes>();
	const [formValues, setFormValues] = useState(initalValues);
	const [errorMessage, setErrorMessage] = useState(initialErrors);
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormValues({
			...formValues,
			[name]: value,
		});

		setErrorMessage({
			...errorMessage,
			[name]: [""],
		});
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setFlashError(false);
		setFlashErrorMessage("");
		const response: AxiosResponse = await resetPasswordConfirm(uid, token, formValues.new_password, formValues.re_new_password);
		switch(response.status) {
		case 400: {
			if (response.data.non_field_errors) {
				setFlashError(true);
				setFlashErrorMessage(response.data.non_field_errors[0]);
				setErrorMessage({
					new_password: ["error"],
					re_new_password: ["error"]
				});
			} else if (response.data.token) {
				setFlashError(true);
				setFlashErrorMessage("Invalid token, resend email");
			} else {
				setErrorMessage({
					new_password: typeof(response.data?.new_password) === "undefined" ? [""]: response.data?.new_password,
					re_new_password: typeof(response.data?.re_new_password) === "undefined" ? [""]: response.data?.re_new_password
				});
			}
			break;
		}
		case 401: {
			logout();
			setFlashError(true);
			setFlashErrorMessage("Auth error detected, try logging in again");
			break;
		}
		case 204: {
			history.push(configuration["url-login"]);
			break;
		}
		default: {
			throw new Error(`Expected Http errors 400, 401 or 204 but recieved ${response.status}`);
		}
		}
	};

	return (
		<Root className={classes.root}>
			<Container component = "main" maxWidth="xs">
				<CssBaseline />
				<Box boxShadow={5} className={classes.paper}>
					<form className={classes.form} noValidate={true} onSubmit = { submit }>	
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography component="div" variant="h5" align="center">
									<strong>Update your password</strong>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle1" align="justify">
								Provide a new strong password for your account. We will send a confirmation email once
								your password is updated.
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FlashError 
									message={ flashErrorMessage }
									display={ flashError }
								/>
							</Grid>
							<Grid item xs={12}>
								<PasswordField
									id="password"
									name="new_password"
									showTooltip= {true}
									value={ formValues.new_password }
									errorMessage={ errorMessage.new_password }
									onChange={ handleChange }/>
							</Grid>
							<Grid item xs={12}>
								<PasswordField
									id="rePassword"
									name="re_new_password"
									inputLabel="Confirm"
									showTooltip= {false}
									value={ formValues.re_new_password }
									errorMessage={ errorMessage.re_new_password }
									onChange={ handleChange }/>
							</Grid>
							<Grid item xs={12}>
								<Button
									className={classes.submit}
									fullWidth
									name="s"
									variant="contained"
									type="submit"
								>
							Update Password
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Link 
									href={configuration["url-login"]}
									variant="body2">
									Back to Login
								</Link>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Container>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Root>
	);
};

export default ResetPasswordConfirm;