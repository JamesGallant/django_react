import React, { FC, useState } from "react";
import { useParams, useHistory } from "react-router";
import { AxiosResponse } from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { CssBaseline, Typography, Button, Link} from "@material-ui/core";

import {resetPasswordConfirm} from "../../api/authentication";
import PasswordField from "../../components/formFields/passwordComponent";
import configuration from "../../utils/config";
import FlashError from "../../components/helper/flashErrors";
import { logout } from "../../modules/authentication";


const useStyles = makeStyles((theme) => ({
	root: {
		position: "absolute",
		flexGrow: 1, 
		left: "50%", 
		top: "50%",
		overflow: "90%",
		transform: "translate(-50%, -50%)",
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		flexWrap: "wrap",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	}
}));

interface ParamTypes {
	uid: string,
	token: string,
}

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
	const classes = useStyles();
	const history = useHistory();

	const {uid, token} = useParams<ParamTypes>();
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

	return(		
		<div className={classes.root}>
			<Container component = "main" maxWidth="xs">
				<CssBaseline />
				<form className={classes.paper} noValidate={true} onSubmit = { submit }>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography component="div" variant="h5" align="center">
								<strong>Update your password</strong>
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography component="div" variant="subtitle1">
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
								inputLabel="Confirm password"
								showTooltip= {false}
								value={ formValues.re_new_password }
								errorMessage={ errorMessage.re_new_password }
								onChange={ handleChange }/>
						</Grid>
						<Grid item xs={12}>
							<Button
								fullWidth
								name="s"
								variant="contained"
								color="primary"
								type="submit"
							>
							Update Password
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Link 
								href={configuration["url-login"]}
								variant="body2">
								<strong>Back to Login</strong>
							</Link>
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>);
};

export default ResetPasswordConfirm;