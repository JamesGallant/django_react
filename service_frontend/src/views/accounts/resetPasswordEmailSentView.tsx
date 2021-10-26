import React, { FC, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { CssBaseline, Typography, Button, Link, Container, Grid, Box} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import configuration from "../../utils/config";
import { resetPassword } from "../../api/authentication";
import FlashError from "../../components/helper/flashErrors";
import { AxiosResponse } from "axios";

interface StateInterface {
	email: string
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		position: "absolute",
		flexGrow: 1, 
		left: "50%", 
		top: "50%",
		transform: "translate(-50%, -50%)"
	},
	paper: {
		padding: theme.spacing(3),
		wordWrap: "break-word",
		minWidth: 500
	},
	buttons: {
		"& > *": {
			margin: theme.spacing(1),
		},
	}
}));

const ResetPasswordEmailSent: FC = (): JSX.Element => {
	const history = useHistory();
	const location = useLocation<StateInterface>();
	const classes = useStyles();

	const [flashErrorMessage, setFlashErrorMessage] = useState("");
	const [flashError, setFlashError] = useState(false);

	if (typeof(location.state) === "undefined") {
		// user accessed this route without submitting a request to change the password, return to password reset
		history.push(configuration["url-resetPassword"]);
	}

	const resendEmail = async (): Promise<void> => {
		setFlashError(false);
		setFlashErrorMessage("");
		const response: AxiosResponse = await resetPassword(location.state.email);
		console.log(response);
		if (response.status === 204) {
			setFlashErrorMessage("Email sent");
			setFlashError(true);
		} else {
			setFlashErrorMessage("Failed to send email");
			setFlashError(true);
		}
	};
	return(
		<div className={classes.root}>
			<Container component = "main" maxWidth="xs">
				<CssBaseline />
				<Box boxShadow={5} className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography component="div" variant="h5" align="center">
								<strong>Password change requested</strong>
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<FlashError 
								message={ flashErrorMessage }
								display={ flashError }
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography component="div" variant="subtitle1" align="justify">
								A request to change your password has been processed and we have sent an email to 
								<Link href={`mailto:${location.state?.email}`} target="_blank" rel="noreferrer"> {location.state?.email}</Link>. 
								No email in your inbox? Check your spam folder. 
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.buttons}>
								<Button variant="text" onClick={ resendEmail } color="primary" size="medium" >Resend email</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-login"]}>Login</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-register"]}>Register</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-home"]}>Home</Button>	
							</div>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</div>
	);
};

export default ResetPasswordEmailSent;