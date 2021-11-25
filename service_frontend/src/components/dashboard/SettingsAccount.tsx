import React, { FC, useState } from "react";
import { useHistory } from "react-router";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectUserData } from "../../store/slices/userSlice";
import { selectSiteConfigData, toggleClearLoginCache } from "../../store/slices/siteConfigurationSlice";

import { Grid, Typography, Divider, Switch, Stack, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import PasswordField from "../common/formFields/passwordComponent";
import configuration from "../../utils/config";
import { resetPassword, deleteUser, resetUsername } from "../../api/authentication";
import { logout } from "../../modules/authentication";
import CookieHandler from "../../modules/cookies";

import type { UserDataInterface } from "../../types/authentication";
import type { SiteConfigDataInterface } from "../../types/store";

import { AxiosResponse } from "axios";

interface LoadingTypes {
	emailChangeUsername: boolean,
	emailChangePassword: boolean,
	deleteUser: boolean
}

const initialLoadingValues: LoadingTypes = {
	emailChangeUsername: false,
	emailChangePassword: false,
	deleteUser: false,
};

const SettingsAccount: FC = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const user: UserDataInterface = useAppSelector(selectUserData);
	const siteConfig: SiteConfigDataInterface = useAppSelector(selectSiteConfigData);
	const cookies = new CookieHandler();
	const theme = useTheme();
	const history = useHistory();

	const [errorMessage, setErrorMessage] = useState([""]);
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(initialLoadingValues);

	const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setPassword(event.target.value);
		setErrorMessage([""]);
	};

	const toggleLogout = (): void => {
		dispatch(toggleClearLoginCache());
	};

	const submitUpdateEmail = async (): Promise<void> => {
		setLoading({
			...loading,
			emailChangeUsername: true
		});

		const response: AxiosResponse = await resetUsername(user.email);

		switch(response.status) {
		case 400: {
			//@TODO handle error here
			setLoading({
				...loading,
				emailChangeUsername: false
			});

			break;
		}
		case 401: {
			logout();
			setLoading({
				...loading,
				emailChangeUsername: false
			});
			history.push(configuration["url-login"]);
			break;
		}
		case 204: {
			setLoading({
				...loading,
				emailChangeUsername: false
			});

			logout();

			history.push(configuration["url-resetEmailSent"], {
				email: user.email,
				changed: "email"
			});
			break;
		}
		default: {
			throw new Error(`Expected HTTPErrors 400 | 401 | 204, but recieved: ${response.status}`);
		}
		}
	};

	const submitChangePassword = async (): Promise<void> => {
		setLoading({
			...loading,
			emailChangePassword: true
		});

		const response: AxiosResponse = await resetPassword(user.email);

		switch(response.status) {
		case 400: {
			//@TODO handle error here
			setLoading({
				...loading,
				emailChangePassword: false
			});
			break;
		}
		case 401: {
			logout();
			setLoading({
				...loading,
				emailChangePassword: false
			});
			history.push(configuration["url-login"]);
			break;
		}
		case 204: {
			setLoading({
				...loading,
				emailChangePassword: false
			});

			logout();

			history.push(configuration["url-resetEmailSent"], {
				email: user.email,
				changed: "password"
			});
			break;
		}
		default: {
			throw new Error(`Expected Http errors 400, 401 or 204 but recieved ${response.status}`);
		}
		}
	};

	const submitDeleteAccount = async (): Promise<void> => {
		setLoading({
			...loading,
			deleteUser: true
		});

		const authToken: string = cookies.getCookie("authToken");
		const response: AxiosResponse = await deleteUser(authToken, password);

		switch (response.status) {
		case 401: {
			setLoading({
				...loading,
				deleteUser: false
			});
			logout();
			history.push(configuration["url-login"]);
			break;
		}
		case 400: {
			setLoading({
				...loading,
				deleteUser: false
			});
			setErrorMessage(response.data.current_password);
			break;
		}
		case 204: {
			setLoading({
				...loading,
				deleteUser: false
			});
			
			logout();

			history.push(configuration["url-home"]);
			break;
		}
		}
	};

	return(
		<div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography gutterBottom variant="subtitle1"> <strong> Account settings</strong></Typography>
					<Divider/>
				</Grid>
				<Grid item xs={12} sx={{marginTop: 0.5}}>
					<Stack spacing={1}>
						<Typography  variant="subtitle2"><strong>Clear cache on log out</strong></Typography>
						<Switch 
							checked={siteConfig.data.clearLoginCache}
							color="secondary"
							onChange={ toggleLogout } 
						/>
						<Typography  
							variant="subtitle1" 
							paragraph 
							sx={{fontSize: 12}}
						>
							By enabling this feature your account will not persist your login details. 
						</Typography>
						<Divider/>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<Typography  variant="subtitle2"> <strong>Change email</strong></Typography>
						<Typography  
							variant="subtitle1" 
							paragraph 
							sx={{fontSize: 12}}
						>We will send a email to <strong>{user.email}</strong>, 
					follow the link to complete the reset. You will be logged out and <strong 
								style={{color: theme.palette.error.main}}>
							you will not be able to login with your old email.
							</strong>
						</Typography>
						<LoadingButton
							onClick={ submitUpdateEmail }
							endIcon={<SaveIcon />}
							loading={loading.emailChangeUsername}
							size="small"
							sx={{width: "15vw"}}
							loadingPosition="end"
							variant="contained"
						>
							Update email
						</LoadingButton>
						<Divider />
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<Typography  variant="subtitle2"> <strong>Change password</strong></Typography>
						<Typography 
							variant="subtitle1"
							paragraph
							sx={{fontSize: 12}}
						>
							Requesting to update your password will log you out and we will send a link to <strong>{user.email}</strong>. Follow the link in your email to complete the process. 
						</Typography>
						<LoadingButton
							onClick={ submitChangePassword }
							endIcon={<SaveIcon />}
							loading={loading.emailChangePassword}
							size="small"
							sx={{width: "15vw"}}
							loadingPosition="end"
							variant="contained"
						>
							Update password
						</LoadingButton>
						<Divider />
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<Typography  variant="subtitle2"> <strong>Delete account</strong></Typography>
						<PasswordField
							id="password"
							showTooltip= {false}
							value={ password }
							errorMessage={ errorMessage }
							required
							onChange={ handleFormInput }/>
						<Typography 
							variant="subtitle1" 
							paragraph
							sx={{fontSize: 12}}
						>Deleting your account will delete all of your data, 
							<strong style={{color: theme.palette.error.main}}>
							there is no going back
							</strong>.
						</Typography>
						<LoadingButton
							onClick={ submitDeleteAccount }
							endIcon={<SaveIcon />}
							loading={loading.deleteUser}
							size="small"
							sx={{width: "15vw"}}
							loadingPosition="end"
							variant="contained"
						>
							Delete account
						</LoadingButton>
						<Divider />
					</Stack>
				</Grid>
			</Grid>
		</div>

	);
};

export default SettingsAccount;