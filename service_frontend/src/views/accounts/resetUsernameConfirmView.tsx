import React, { FC, useState } from "react";
import { useParams, useHistory } from "react-router";

import { Container, CssBaseline, Box, Grid, Typography, Divider, Button } from "@mui/material";

import TextField from "../../components/common/formFields/TextFieldComponent";
import FlashError from "../../components/common/helper/flashErrors";

import { logout } from "../../modules/authentication";
import configuration from "../../utils/config";
import { CentredSubmitFormRoot } from "../../utils/commonStyles";
import { resetUsernameConfirm } from "../../api/authentication";

import type { UrlAuthTokenTypes } from "../../types/authentication";
import type { AxiosResponse } from "axios";
const { Root, classes} = CentredSubmitFormRoot("ResetUsernameConfirm");

//TODO add a popup to alert user that change was successfull before logout
const ResetUsernameConfirm: FC = (): JSX.Element => {
	
	const history = useHistory();
	const { uid, token } = useParams<UrlAuthTokenTypes>();
	
	const [newEmail, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState([""]);
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setEmail(event.target.value);
		setErrorMessage([""]);
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setFlashError(false);
		setFlashErrorMessage("");

		const response: AxiosResponse = await resetUsernameConfirm(uid, token, newEmail);
		switch(response.status) {
		case 400: {
			if (response.data.non_field_errors) {
				setFlashError(true);
				setFlashErrorMessage(response.data.non_field_errors[0]);
				setErrorMessage(["error"]);
			} else if(response.data.new_email) {
				setErrorMessage(response.data.new_email);
			} else if(response.data.token) {
				logout();
				setFlashError(true);
				setFlashErrorMessage("Auth error detected, Account not reset");
			}
			break;
		}
		case 401: {
			logout();
			setFlashError(true);
			setFlashErrorMessage("Auth error detected, Account not reset");
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

	return(
		<Root className={classes.root}>
			<Container component = "main" maxWidth="xs">
				<CssBaseline />
				<Box boxShadow={5} className={classes.paper}>
					<form className={classes.form} noValidate={true} onSubmit = { submit }>
						<Grid container spacing={2}>
							<Grid item  xs={12}>
								<Typography component="div" variant="h5" align="center">
									<strong>Update your email</strong>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FlashError 
									message={ flashErrorMessage }
									display={ flashError }
								/>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle1" align="justify">
									We will send a confirmation email once your log in details are updated.
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField 
									id="newEmail"
									name="newEmail"
									label="New email"
									fullWidth={true} 
									required={true}
									value = { newEmail }
									onChange={ handleChange }
									errorMessage={ errorMessage }
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									className={classes.submit}
									fullWidth
									name="s"
									variant="contained"
									type="submit"
								>
									Update email
								</Button>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Container>
		</Root>
	);
};

export default ResetUsernameConfirm;