import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

import TextField from "../../components/formFields/TextFieldComponent";
import PasswordField from "../../components/formFields/passwordComponent";
import Copyright from "../../components/helper/copyrightComponent";

import configuration from "../../utils/config";
import { postTokenLogin, getUserData } from "../../api/authentication";
import CookieHandler from "../../modules/cookies";

import FlashError from "../../components/helper/flashErrors";
import {login} from "../../modules/authentication";
import { AxiosResponse } from "axios";


const useStyles = makeStyles((theme) => ({
	root: {
		position: "absolute",
		flexGrow: 1, 
		left: "50%", 
		top: "50%",
		transform: "translate(-50%, -50%)"
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
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

interface formTypes {
    email: string,
    password: string,
}

interface errTypes {
    email: string[],
    password: string[],
}

const initialFormVals: formTypes = {
	email: "",
	password: "",
};

const initialErrs: errTypes = {
	email: [""],
	password: [""], 
};

const LoginViewPage: React.FC = (): JSX.Element => {
	/**
     * @description Component that handles the login logic. Sends a request to the accounts backend for a token.
     * API endpoint requires email and password and returns [status] and token or [errors]
     * @resource securely saving auth tokens: https://www.rdegges.com/2018/please-stop-using-local-storage/
     */

	const classes = useStyles();
	const history = useHistory();
	const [formValues, setFormValues] = useState(initialFormVals);
	const [errorMessage, setErrorMessage] = useState(initialErrs);
	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);
	const [checkboxValue, setCheckboxValue] = useState(false);

	const cookieHandler = new CookieHandler();
    
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

	const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCheckboxValue(event.target.checked);
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		/**
         * @description Handles the form submission. Should send a AJAX request to the user login endpoint
         * @resource https://djoser.readthedocs.io/en/latest/token_endpoints.html#token-create
         */
		event.preventDefault();
		setFlashError(false);
		setFlashErrorMessage("");

		const response: AxiosResponse = await postTokenLogin(formValues.email, formValues.password);
		const statusCode: number = response.status;

		switch(statusCode) {
		case 400: {
			if (response.data.non_field_errors) {
				setFlashError(true); 
				setFlashErrorMessage("Invalid username or password");
			} else {
				setErrorMessage({
					email: typeof(response.data?.email) === "undefined" ? [""]: response.data?.email,
					password: typeof(response.data?.password) === "undefined" ? [""]: response.data?.password
				});
			}
			break;
		}

		case 401: {
			setFlashError(true);
			setFlashErrorMessage("No account found, please register first");
			break;
		}

		case 200: {
			const cookiePayload = {
				name: "authToken",
				value: response.data.auth_token,
				duration: checkboxValue ? configuration["cookie-maxAuthDuration"] : 0,
				path: "/",
				secure: true
			};
			cookieHandler.setCookie(cookiePayload);
			// get user data
			const userDataResponse: AxiosResponse = await getUserData(response.data.auth_token);
			if (userDataResponse.data["details"]) {
				window.localStorage.setItem("authenticated", "false");
				cookieHandler.deleteCookie("authToken");
				throw new Error("authentification failed due to malformed token, login again");
			}
                
			window.localStorage.setItem("authenticated", "true");
			history.push(configuration["url-dashboard"]);

			break;
		}
		default:
			throw new Error(`Status code ${response.status} is invalid. 
                Check https://djoser.readthedocs.io/en/latest/token_endpoints.html#token-create`);
		}
	};

	return(
		<div className = {classes.root}>
			<Container component = "main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
                        Sign in to {process.env.REACT_APP_SITE_NAME}
					</Typography>
					<form className={classes.form} noValidate={true} onSubmit = { submit }>
                    
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FlashError 
									message={ flashErrorMessage }
									display={ flashError }
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField 
									id="email"
									name="email"
									label="email"
									fullWidth = {true}           
									required={true}
									value = {formValues.email}
									onChange={ handleChange }
									errorMessage={ errorMessage.email }
								/>
							</Grid>
							<Grid item xs={12}>
								<PasswordField
									id="password"
									name="password"
									showTooltip= {false}
									value={ formValues.password }
									errorMessage={ errorMessage.password }
									onChange={ handleChange }/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox 
										value="remember" 
										color="primary"
										onChange = { handleCheckbox }
									/>}
									label="Remember me"
								/>
							</Grid>
							<Grid item xs={12}>
								<Link href={configuration["url-resetPassword"]}>
									<strong>Forgot Password?</strong>
								</Link>
							</Grid>
						</Grid>
						<Button
							fullWidth
							name="s"
							variant="contained"
							color="primary"
							type="submit"
							className={classes.submit}
						>
                        Sign in
						</Button>
						<Grid container>
							<Grid item>
								<Link href={configuration["url-register"]} variant="body2">
                            New to {process.env.REACT_APP_SITE_NAME}? create an account
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</div>
	);
};

const LoginView = (): JSX.Element => {
	const history = useHistory();

	useEffect(() => {
		login();
	}, []);

	if (window.localStorage.getItem("authenticated") === "true") {
		history.push(configuration["url-dashboard"]);
	} else {
		return(
			<LoginViewPage />
		);
	}

	return (
		<div></div>
	);
};


export default LoginView;