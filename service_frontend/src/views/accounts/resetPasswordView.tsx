import React, {FC, useState} from "react";
import { useHistory } from "react-router";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline, Typography, Button, Link, Container, Grid} from "@material-ui/core";

import TextField from "../../components/formFields/TextFieldComponent";
import configuration from "../../utils/config";
import { resetPassword } from "../../api/authentication";
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

const ResetPassword: FC = (): JSX.Element => {
	const classes = useStyles();
	const history = useHistory();

	const [formValue, setFormValues] = useState("");
	const [errorMessage, setErrorMessage] = useState([""]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setFormValues(event.target.value);
		setErrorMessage([""]);
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const response = await resetPassword(formValue);
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
			history.push(configuration["url-login"]);
			break;
		}
		case 204: {
			//@TODO reroute to info view
			history.push(configuration["url-resetPasswordEmailSent"], {
				email: formValue,
			});
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
								value = {formValue}
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
								variant="body2">
								Remembered it? Login
							</Link>
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	);
};

export default ResetPassword;