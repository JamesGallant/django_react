import React, { FC, useState } from "react";
import { useNavigate } from "react-router";

// material ui
import { Button, CssBaseline, Typography, Link, Container, Grid, Box } from "@mui/material";
import { CentredSubmitFormRoot } from "../../../utils/commonStyles";

import TextField from "../../common/formFields/TextFieldComponent";
import Copyright from "../../common/helper/copyrightComponent";
import configuration from "../../../utils/config";
import { resetPassword } from "../../../api/authenticationAPI";
import { logout } from "../../../modules/authentication";

const { Root, classes } = CentredSubmitFormRoot("ResetPassword");

const ResetPassword: FC = (): JSX.Element => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState([""]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setEmail(event.target.value);
		setErrorMessage([""]);
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const parsedEmail = email.toLowerCase();
		const response = await resetPassword(parsedEmail);
		switch(response.status) {
		case 400: {
			let errorMessageResponse: string[];
			if(response.data.email) {
				errorMessageResponse = response.data.email;
			} else if(response.data) {
				errorMessageResponse = response.data;
			} else {
				errorMessageResponse = [""];
			}
			setErrorMessage(errorMessageResponse);
			break;
		}
		case 401: {
			logout();
			navigate(configuration["url-login"]);
			break;
		}
		case 204: {
			navigate(configuration["url-resetEmailSent"], {
				state: {
					email: parsedEmail,
					changed: "password",
				}
			});
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
									<strong>Forgot your password?</strong>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography component="div" variant="subtitle1">
								Provide the email used for your account, we will send a reset link.
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField 
									id="email"
									name="email"
									label="email"
									fullWidth = {true}           
									required={true}
									value = {email}
									onChange={ handleChange }
									errorMessage={ errorMessage}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									fullWidth
									name="s"
									variant="contained"
									color="primary"
									type="submit"
								>
								Reset Password
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Link 
									href={configuration["url-login"]}
									variant="subtitle1">
									Log in instead
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

export default ResetPassword;