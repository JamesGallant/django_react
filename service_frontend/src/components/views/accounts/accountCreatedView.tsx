import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {Button, Box, styled, Container, CssBaseline, Grid, Typography, Link } from "@mui/material";
import { AxiosResponse } from "axios";

import configuration from "../../../utils/config";
import { postSendEmail } from "../../../api/authenticationAPI";


const PREFIX = "accountCreated";

const classes = {
	root: `${PREFIX}-root`,
	paper: `${PREFIX}-paper`
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
	}
}));

const AccountCreatedView : FC = () => {
	/**
     * @description Redirects user to login or register based on the email link. to login if account creation is successfull or the account exists, to
     * register if the account is deleted or password is mangled. 
     * 
     * @Resource https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-resend-activation-e-mail
     */

	const location: any = useLocation();
	const navigate = useNavigate();

	const email: string = location.state.email;
	const firstName: string = location.state.firstName;

	const resendEmail = async () => {
		const response: AxiosResponse = await postSendEmail(email);
		const statusCode: number = response.status;

		switch(statusCode) {
		case 204: 
			// TODO change to error dialog
			alert(`email sent to ${email}`);
			break;
		case 400:
			navigate(configuration["url-login"]);
			break;
		default:
			throw new Error("Invalid status code, options are 400 or 200. see: https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-resend-activation-e-mail");
		}
	};
	//@TODO beutify this
	return(
		<Root className={classes.root}>
			<Box boxShadow={5} className={classes.paper}>
				<Container component = "main" maxWidth="xs">
					<CssBaseline />
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography component="div" variant="h5" align="center">
								<strong>Thank you for creating an account with {process.env.REACT_APP_SITE_NAME}</strong>
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" align="justify" gutterBottom={true} paragraph={true}>
								Hi { firstName }, thank you for creating an account with us. We have sent an email to <Link href={`mailto:${email}`} target="_blank" rel="noreferrer">{ email }
								</Link> which contains a link to activate your account. Please activate your account before logging in.
							</Typography>
						</Grid>
					</Grid>
					<Button variant="text" color="primary" size="medium" onClick={ resendEmail }> Resend activation email </Button>
				</Container>
			</Box>
		</Root>
	);
};

export default AccountCreatedView;