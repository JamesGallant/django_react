import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getRegisteredApp, selectAppData, selectAppStateStatus } from "../../../store/slices/registeredAppsSlice";
import { selectUserData } from "../../../store/slices/userSlice";
import {linkApp, selectUserApps, getUserApps, updateAppExpirationDate} from "../../../store/slices/userOwnedAppsSlice";
import { resetPurchaseDialog, selectPurchaseDialogData, setActiveStep, setAppID } from "../../../store/slices/purchaseDialogSlice";

import { Box, Typography, Button, Stack, Divider, Grid, CircularProgress, useMediaQuery, DialogContentText, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MediaCard from "../../common/cards/MediaCard";
import ContentDialog from "../../common/dialogs/ContentDialog";
import CookieHandler from "../../../modules/cookies";
import PurchaseDialog from "../../dashboard/appStore/purchaseDialog";
import PurchaseButton from "../../dashboard/appStore/purchaseButton";
import configuration from "../../../utils/config";

import type { RegisterAppPayloadInterface, AppDataUnion, AppDataInterface, linkAppPayloadInterface, 
	UserOwnedAppsPagedInterface, PatchExpirationDateInterface } from "../../../types/applicationTypes";

import type { UserDataInterface } from "../../../types/authentication";
import type { PurchaseDialogData } from "../../../types/purchaseDialogTypes";
import type { AlertColor } from "@mui/material/Alert";

interface LearnMoreDialogInterface {
	title: string
	content: string
}

const initialLearnMoreValues: LearnMoreDialogInterface = {
	title: "",
	content: ""
};

interface SnackBarInterface {
	open: boolean
	variant: AlertColor
}

const initialSnackBarValues: SnackBarInterface = {
	open: false,
	variant: "success",
};

const AppStoreView = (): JSX.Element | null => {
	const navigate = useNavigate();
	
	const theme = useTheme();
	const cookies: CookieHandler = new CookieHandler();
	const token: string = cookies.getCookie("authToken");

	// redux
	const dispatch = useAppDispatch();
	const registeredApps: AppDataUnion = useAppSelector(selectAppData);
	const appStateStatus: string = useAppSelector(selectAppStateStatus);
	const user: UserDataInterface = useAppSelector(selectUserData);
	const ownedApps: UserOwnedAppsPagedInterface = useAppSelector(selectUserApps);
	const purchaseDialogData: PurchaseDialogData = useAppSelector(selectPurchaseDialogData);
	
	// dialog states
	const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
	const [purchaseDialogTitle, setPurchaseDialogTitle] = useState("");
	const [isLearnMoreDialogOpen, setLearnMoreDialogOpen] = useState(false);
	const [learnMoreDialog, setLearnMoreDialog] = useState(initialLearnMoreValues);

	//snackbar
	const [snackbar, setSnackBar] = useState(initialSnackBarValues);

	useEffect(() => {
		const getApps = async () => {
			const payload: RegisterAppPayloadInterface = {
				authToken: token,
				url: ""
			};
			await dispatch(getRegisteredApp(payload));
			if (registeredApps.detail) {
				//TODO some error handling
				alert(registeredApps.detail);
			}
		};

		const getOwnedApps = async () => {
			await dispatch(getUserApps(token));
		};
		
		getOwnedApps();
		getApps();
	},[dispatch]);

	// generate app dialogs
	const renderPurchaseDialog = (app: AppDataInterface) => {
		setPurchaseDialogOpen(true);
		setPurchaseDialogTitle(`Purchase ${app.name}`);
		dispatch(setAppID(app.id));
	};

	const renderLearnMoreDialog = (title: string, content: string) => {
		setLearnMoreDialogOpen(true);
		setLearnMoreDialog({
			title: `More about ${title}`,
			content: content
		});
	};

	const purchaseDialogNext = async () => {
		if (purchaseDialogData.data.activeStep === purchaseDialogData.data.steps.length - 1) {
			setPurchaseDialogOpen(false);

			// TODO rethink this section
			const date: Date = new Date();
			const newDate: Date = new Date(date.setMonth(date.getMonth() + purchaseDialogData.data.configuration.duration));
			const month = newDate.getMonth() < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
			const day =  newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
			const expirationDate = `${newDate.getFullYear()}-${month}-${day}`;
			const hasExpiredApp =  ownedApps.results?.some(element => element.app === purchaseDialogData.data.appID && element.is_expired);

			// can this be done more concisely
			if (hasExpiredApp) {
				const targetApp= ownedApps.results?.find(el => el.app === purchaseDialogData.data.appID);

				const updateExpirationDatePayload: PatchExpirationDateInterface = {
					authToken: token,
					id: targetApp?.id as number,
					expirationDate: expirationDate

				};
				const patchAppResponse = await dispatch(updateAppExpirationDate(updateExpirationDatePayload));
				switch(patchAppResponse.meta.requestStatus) {
				case "fulfilled": {
					const alertVariant = patchAppResponse.payload.detail || patchAppResponse.payload.non_field_errors || patchAppResponse.payload.message ? "error" : "success";
					setSnackBar({
						...snackbar,
						open: true,
						variant: alertVariant
					});
					break;
				}
				case "rejected": {
					setSnackBar({
						...snackbar,
						open: true,
						variant: "error"
					});
					break;
				}
				}
			} else {
				const payload: linkAppPayloadInterface = {
					authToken: token,
					data: {
						expiration_date: expirationDate,
						app: purchaseDialogData.data.appID,
						user: user.id as number
					}
				};
				// this dispatch if there is no record otherwise dispatch a put
				const appLinkResponse = await dispatch(linkApp(payload));
				if (appLinkResponse.meta.requestStatus === "fulfilled") {
					const alertVariant = appLinkResponse.payload.detail || appLinkResponse.payload.non_field_errors || appLinkResponse.payload.message ? "error" : "success";
					if (alertVariant === "success") {
						await dispatch(getUserApps(token));
					}
	
					setSnackBar({
						...snackbar,
						open: true,
						variant: alertVariant
					});
				}
			}

			dispatch(resetPurchaseDialog());
		} else {
			dispatch(setActiveStep(purchaseDialogData.data.activeStep + 1));
		}
	};

	const cancelPurchaseDialog = (): void => {
		dispatch(resetPurchaseDialog());
		setPurchaseDialogOpen(false);
	};

	const appList = registeredApps.results?.map((app, index) => {
		const purchased = ownedApps.results?.some(element => element.app === app.id && !element.is_expired) as boolean;
		const handleCardClick = () => {
			// this should be one url and this should be an api
			if (Object.values(configuration).includes(app.url)) {
				navigate(app.url, {
					state: {
						appID: app.id
					}
				});
			} else {
				setSnackBar({
					...snackbar,
					open: true,
					variant: "error"
				});
			}
		};

		return(
			<Grid key={index} item  xs={12} sm={4} md={3}>
				{ appStateStatus === "pending" ? <CircularProgress /> : 
					<MediaCard
						key={index}
						cardSx={{minWidth: "10rem"}} 
						actionAreaSx={{height: "25rem", minWidth: "10rem", marginTop: -10}}
						mediaHeight="140"
						mediaComponent="img"
						mediaSrc="https://picsum.photos/200/300"
						disabled={ !purchased || app.disabled }
						onCardClick={handleCardClick}
						cardContentElements={
							<Grid container
								alignItems="flex-start"
								justifyContent="center"
								direction="column"
							>
								<Grid item xs={12}>
									<Typography variant="h4" color="text.secondary" gutterBottom sx={{wordWrap: "break-word", maxHeight: 40 }}>
										{app.name}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography
										variant="subtitle2"
										color="text.secondary"
										sx={{ textOverflow: "ellipsis", maxHeight: 5 }}
									>
										{app.card_description}
									</Typography>
								</Grid>
							</Grid>
						}
						cardActionElements={
							<Box sx={{width: "100%", display: "flex", paddingBottom: 1}} justifyContent="space-between" alignItems="center">
								<Box sx={{paddingLeft: 2}} justifyContent="flex-start">
									<Button onClick={() => renderLearnMoreDialog(app.name, app.full_description)}>About</Button>
								</Box>
								<Divider orientation="vertical" flexItem />
								<Box sx={{paddingRight: 2}} justifyContent="flex-end">
									<PurchaseButton disabled={app.disabled} purchased={purchased} onClick={() => renderPurchaseDialog(app)}/>
								</Box>
							</Box>
						}
					/>
				}
			</Grid>
		);
	});

	// snackbar functions
	const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}

		setSnackBar({
			...snackbar,
			open: false
		});
	};

	const handleBack = (): void => {
		dispatch(setActiveStep(purchaseDialogData.data.activeStep - 1));
	};

	return (
		<Box sx={{marginLeft: "10%", marginRight: "10%", flexGrow: 1}}>
			<h1>Apps</h1>
			<Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				{ appList }
			</Grid>
			<PurchaseDialog 
				isOpen={isPurchaseDialogOpen}
				onClose={cancelPurchaseDialog}
				nextFn={purchaseDialogNext}
				backFn={handleBack}
				title={purchaseDialogTitle}
			/>

			<ContentDialog 
				maxWidth="md"
				fullScreen={ useMediaQuery(theme.breakpoints.down("sm")) }
				isOpen={isLearnMoreDialogOpen}
				title={learnMoreDialog.title}
				cancelBtnText="Ok"
				onClose={ () => setLearnMoreDialogOpen(false)}
				content={
					<DialogContentText variant="subtitle1">
						{learnMoreDialog.content}
					</DialogContentText>
				}
			/>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				sx={{borderColor: snackbar.variant}}
				anchorOrigin={{"vertical": "bottom", "horizontal": "right"}}
				onClose={handleCloseSnackBar}
			>
				<Alert severity={snackbar.variant} sx={{ width: "100%" }} onClose={handleCloseSnackBar}>
					{snackbar.variant}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default AppStoreView;