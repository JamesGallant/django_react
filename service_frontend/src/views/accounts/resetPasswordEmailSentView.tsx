import React, { FC, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { Button, CssBaseline, Typography,  Link, Container, Grid, Box , styled, Stack } from "@mui/material";

import configuration from "../../utils/config";
import { resetPassword } from "../../api/authentication";
import FlashError from "../../components/helper/flashErrors";
import { AxiosResponse } from "axios";

const PREFIX = "ResetPasswordEmailSent";

const classes = {
	root: `${PREFIX}-root`,
	paper: `${PREFIX}-paper`,
	buttons: `${PREFIX}-buttons`
};

const Root = styled("div")(({theme}) => ({
	[`&.${classes.root}`]: {
		position: "absolute",
		flexGrow: 1, 
		left: "50%", 
		top: "50%",
		transform: "translate(-50%, -50%)"
	},

	[`& .${classes.paper}`]: {
		padding: theme.spacing(3),
		wordWrap: "break-word",
		minWidth: 500
	},

	[`& .${classes.buttons}`]: {
		"&:hover": {
			backgroundcolor: "red",
		},
	}
}));

interface StateInterface {
	email: string
}

const ResetPasswordEmailSent: FC = (): JSX.Element => {
	const history = useHistory();
	const location = useLocation<StateInterface>();


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
		if (response.status === 204) {
			setFlashErrorMessage("Email sent");
			setFlashError(true);
		} else {
			setFlashErrorMessage("Failed to send email");
			setFlashError(true);
		}
	};
	return (
		<Root className={classes.root}>
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
							<Stack direction="row" spacing={2}>
								<Button variant="text" onClick={ resendEmail } color="primary" size="medium" >Resend email</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-login"]}>Login</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-register"]}>Register</Button>
								<Button variant="text" color="primary" size="medium" href={configuration["url-home"]}>Home</Button>	
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Root>
	);
};

export default ResetPasswordEmailSent;