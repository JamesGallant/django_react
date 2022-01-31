import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button, Stack, Divider, Grid, CircularProgress, useMediaQuery, DialogContentText, Autocomplete, 
	TextField, Switch, Snackbar, Alert } from "@mui/material";

import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import { useTheme } from "@mui/material/styles";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getRegisteredApp, selectAppData, selectAppStateStatus } from "../../../store/slices/registeredAppsSlice";
import { selectUserData } from "../../../store/slices/userSlice";
import {linkApp, selectUserApps, getUserApps, updateAppExpirationDate} from "../../../store/slices/userOwnedAppsSlice";

import MediaCard from "../../common/cards/MediaCard";
import BasicCard from "../../common/cards/basicCard";
import ContentDialog from "../../common/dialogs/ContentDialog";
import CookieHandler from "../../../modules/cookies";
import BasicStepper from "../../common/steppers/basicStepper";
import IconList from "../../common/Lists/iconList";

import type { RegisterAppPayloadInterface, AppDataUnion, 
	subscriptionOptions, AppDataInterface, linkAppPayloadInterface, 
	UserOwnedAppsPagedInterface, PatchExpirationDateInterface } from "../../../types/applicationTypes";

import type { UserDataInterface } from "../../../types/authentication";
import type { AlertColor } from "@mui/material/Alert";
import configuration from "../../../utils/config";


interface LearnMoreDialogInterface {
	title: string
	content: string
}

type subscriptionCardSelectionType = {
	demo: boolean
	basic: boolean
	premium: boolean
}

type subscriptionCardDescription = {
	demo: string
	basic: string
	premium: string
}


interface AppValueInterface {
	basic: {
		currency: string
		cost: number
	}
	premium: {
		currency: string
		cost: number
	}
}

interface subscriptionCard  {
	subscription: subscriptionOptions
	appName: string
	appID: number
	description: subscriptionCardDescription
	appValue: AppValueInterface
}

interface userSubscriptionInterface {
	subscription: subscriptionOptions,
	durationText: string
	duration: number
	multiplier: number
	discountInfo: string
	autoRenewMessage: string
	emailReminderMessage: string
}
interface PurchaseDialogInterface {
	steps: Array<string>
	activeStep: number
	cardSelection: subscriptionCardSelectionType
	userSubscription: userSubscriptionInterface
	apiContent: subscriptionCard
}

const intialPurchaseProps: PurchaseDialogInterface = {
	steps: ["Subscriptions", "configure plan", "payment options", "complete"],
	activeStep: 0,
	cardSelection: {
		demo: false,
		basic: false,
		premium: false
	},
	userSubscription: {
		subscription: "UNDEFINED",
		durationText: "1 month",
		duration: 1,
		multiplier: 1,
		discountInfo: "",
		autoRenewMessage: "",
		emailReminderMessage: ""
	},
	apiContent: {
		subscription: "UNDEFINED",
		appName: "",
		appID: 0,
		description: {
			demo: "",
			basic: "",
			premium: ""
		},
		appValue: {
			basic: {
				currency: "",
				cost: 0.00
			},
			premium: {
				currency: "",
				cost: 0.00
			}
		}
	}
};

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
	/**
	 * This component will eventually be an appstore when we have apps. For now rendering the first application
	 * 
	 * card functions: 
	 * disabled if disabled or not purchased
	 * click purchase displayes purchase options
	 * 
	 */
	
	// redux
	const dispatch = useAppDispatch();
	const registeredApps: AppDataUnion = useAppSelector(selectAppData);
	const appStateStatus: string = useAppSelector(selectAppStateStatus);
	const user: UserDataInterface = useAppSelector(selectUserData);
	const ownedApps: UserOwnedAppsPagedInterface = useAppSelector(selectUserApps);
	

	// dialog states
	const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
	const [purchaseDialogTitle, setPurchaseDialogTitle] = useState("");
	const [purchaseDialogProps, setPurchaseDialogProps] = useState(intialPurchaseProps);

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
		setPurchaseDialogProps({
			...purchaseDialogProps,
			apiContent: {
				subscription: app.subscription_type,
				appName: app.name,
				appID: app.id,
				description: {
					demo: app.demo_app_description,
					basic: app.basic_app_description,
					premium: app.premium_app_description
				}, 
				appValue: {
					basic: {
						currency: app.basic_cost_currency,
						cost: app.basic_cost
					},
					premium: {
						currency: app.premium_cost_currency,
						cost: app.premium_cost
					}
				}
			}
		});
	};

	const renderLearnMoreDialog = (title: string, content: string) => {
		setLearnMoreDialogOpen(true);
		setLearnMoreDialog({
			title: `More about ${title}`,
			content: content
		});
	};

	const purchaseDialogNext = async () => {
		if (purchaseDialogProps.activeStep === purchaseDialogProps.steps.length - 1) {
			setPurchaseDialogOpen(false);
			const date: Date = new Date();
			const newDate: Date = new Date(date.setMonth(date.getMonth() + purchaseDialogProps.userSubscription.duration));
			const month = newDate.getMonth() < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
			const day =  newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
			const expirationDate = `${newDate.getFullYear()}-${month}-${day}`;
			const hasExpiredApp =  ownedApps.results?.some(element => element.app === purchaseDialogProps.apiContent.appID && element.is_expired);

			// can this be done more concisely
			if (hasExpiredApp) {
				const targetApp= ownedApps.results?.find(el => el.app === purchaseDialogProps.apiContent.appID);

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
						app: purchaseDialogProps.apiContent.appID,
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

			setPurchaseDialogProps(intialPurchaseProps);
		} else {
			setPurchaseDialogProps({
				...purchaseDialogProps,
				activeStep: purchaseDialogProps.activeStep + 1
			});
		}
	};

	const cancelPurchaseDialog = (): void => {
		setPurchaseDialogOpen(false);
		setPurchaseDialogProps(intialPurchaseProps);
	};

	const handlePurchaseDialogBack = (): void => {
		setPurchaseDialogProps({
			...purchaseDialogProps,
			activeStep: purchaseDialogProps.activeStep - 1,
			userSubscription:{
				...purchaseDialogProps.userSubscription,
			}
		});
	};

	const setSelectedCard = (subscription: string): void => {
		switch(subscription) {
		case "DEMO": {
			setPurchaseDialogProps({
				...purchaseDialogProps,
				cardSelection: {
					demo: true,
					basic: false,
					premium: false
				},
				userSubscription: {
					...purchaseDialogProps.userSubscription,
					subscription: "DEMO",
				},
			});
			break;
		}
		case "BASIC": {
			setPurchaseDialogProps({
				...purchaseDialogProps,
				cardSelection: {
					demo: false,
					basic: true,
					premium: false
				},
				userSubscription: {
					...purchaseDialogProps.userSubscription,
					subscription: "BASIC",
				},
			});
			break;
		}
		case "PREMIUM": {
			setPurchaseDialogProps({
				...purchaseDialogProps,
				cardSelection: {
					demo: false,
					basic: false,
					premium: true
				},
				userSubscription: {
					...purchaseDialogProps.userSubscription,
					subscription: "PREMIUM",
				},
			});
			break;
		}
		}
	};

	// generate apps

	const renderDynamicPurchaseBtn = (app: AppDataInterface, purchased: boolean): JSX.Element => {
		return(
			<Box>
				{app.disabled ? 
					<Typography variant="subtitle2" color="info">
						<strong>Coming Soon</strong>
					</Typography>
					:
					purchased ? 
						<Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
							<Typography variant="subtitle2" color="text.secondary" sx={{wordWrap: "break-word"}}>
								<strong>OWNED</strong>
							</Typography>
							<CheckCircleOutlineSharpIcon 
								color="success"
							/>
						</Stack>
						:
						<Button onClick={() => renderPurchaseDialog(app)}>Purchase</Button>
				}
			</Box>
		);
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
			<Grid key={index} item xs={3}>
				{ appStateStatus === "pending" ? <CircularProgress /> : 
					<MediaCard
						key={index} 
						cardSx={{ width: "15rem", height: "20rem", position: "absolute"}}
						mediaHeight="140"
						mediaComponent="img"
						mediaSrc="https://picsum.photos/200/300"
						clickable={ purchased && !app.disabled }
						onCardClick={handleCardClick}
						cardContentElements={
							<Stack 
								direction="column"
								spacing={1}
								divider={<Divider orientation="vertical" flexItem />}
							>
								<Typography variant="h4" color="text.secondary" sx={{wordWrap: "break-word"}}>
									{app.name}
								</Typography>
								<Typography 
									variant="subtitle2" 
									color="text.secondary" 
									sx={{wordWrap: "break-word", textOverflow: "ellipsis"}}
								>
									{ app.card_description}
								</Typography>
							</Stack>
						}
						cardActionElements={
							<Stack 
								direction="row" 
								sx={{position: "absolute", bottom: "10px"}}  
								alignItems="center" 
								justifyContent="space-between" spacing={1} 
								divider={<Divider orientation="vertical" flexItem />}
							>
								<Button onClick={() => renderLearnMoreDialog(app.name, app.full_description)}>Learn more</Button>
								{renderDynamicPurchaseBtn(app, purchased)}
							</Stack>
						}
					/>
				}
			</Grid>
		);
	});
		
	// subscription content
	const renderStepContent = () => {
		//first stepper
		const renderAppCost = (subscription: string, multiplier=0): JSX.Element => {
			const costTypography = (selector: string): JSX.Element => {
				
				const costToPurchase = purchaseDialogProps.apiContent.appValue[selector as keyof AppValueInterface].cost;
				return(
					<div>
						{multiplier === 0 ? 
							<Grid container>
								<Grid item xs={12}>
									<Typography variant="h5" align="center">
										{purchaseDialogProps.apiContent.appValue[selector as keyof AppValueInterface].currency} {costToPurchase}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="subtitle2" align="center" gutterBottom>
											per month
									</Typography>
								</Grid>
							</Grid> 
							:
							<Typography variant="h5">
								{purchaseDialogProps.apiContent.appValue[selector as keyof AppValueInterface].currency} { (costToPurchase * multiplier).toFixed(2) }
							</Typography>
						}
					</div>

				);
			};

			switch(subscription) {
			case "DEMO": {
				return (
					<Typography variant="h5" align="center" gutterBottom>
						FREE
					</Typography>
				);
			}
			case "BASIC": {
				return(
					<Box>
						{purchaseDialogProps.apiContent.appValue.basic.cost === 0.00 ? 
							<Typography variant="h5" align="center" gutterBottom>
								FREE
							</Typography> :
							<Box>
								{ costTypography("basic") }
							</Box>
						}
					</Box>
				);
			}
			case "PREMIUM": {
				return(
					<Box>
						{purchaseDialogProps.apiContent.appValue.premium.cost === 0.00 ? 
							<Typography variant="h5" align="center" gutterBottom>
								FREE
							</Typography> :
							<Box>
								{ costTypography("premium") }
							</Box>
						}
					</Box>
				);
			}
			case "UNDEFINED": {
				return <div />;
			}
			default: {
				throw new Error(`Expected subscription to equal (DEMO, BASIC or PREMIUM) but recieved ${subscription}`);
			}
			}
		};

		const cardList = purchaseDialogProps.apiContent.subscription.split("|").map((sub, index) => {
			const cardDescriptions = purchaseDialogProps.apiContent.description[sub.toLowerCase() as keyof subscriptionCardDescription]?.split("|").map((item, index) => {
				return(
					<IconList 
						key={index} 
						dense={false} 
						primaryText={item} 
						icon={<CheckCircleOutlineSharpIcon />} 
						iconSX={{color: "primary.main"}}/>
				);
			});
			
			return (
				<BasicCard 
					key={index}
					cardSX={{border: purchaseDialogProps.cardSelection[sub.toLowerCase() as keyof subscriptionCardSelectionType ] ? 2 : 0, 
						borderColor: purchaseDialogProps.cardSelection[sub.toLowerCase() as keyof subscriptionCardSelectionType] ? "secondary.main": null,
						width: "15rem", height: "25rem", marginLeft: "2.5rem"}}
					actionArea={false}
					onCardClick={() => setSelectedCard(sub)}
					raised={true}
					content={
						<Box>
							<Typography variant="h5" align="center" gutterBottom><strong>{sub}</strong></Typography>
							<Divider variant="middle" sx={{marginBottom: 2}}/>

							<Typography variant="h5" align="center" gutterBottom>
								<strong>{renderAppCost(sub)}</strong>
							</Typography>

							<Divider variant="middle" sx={{marginBottom: 2}}/>
							<Box sx={{maxHeight: "10rem", overflow: "auto"}}>
								{ cardDescriptions }
							</Box>
							

							<Button 
								onClick={() => setSelectedCard(sub)} 
								variant="outlined"
								sx={{
									position: "absolute", 
									bottom: "6rem"
								}}
							> 
									Select plan
							</Button>
						</Box>
					}
				/>
			);
		});

		//second stepper
		const [renew, setRenew] = useState(false);
		const [reminder, setReminder] = useState(false);
		const renderConfigurePlan = (): JSX.Element => {
			const purchaseOptions= [
				{durationText: "1 month", duration: 1, multiplier: 1, discountInfo: ""},
				{durationText: "6 months", duration: 6, multiplier:  5, discountInfo: "One month free"},
				{durationText: "1 year", duration: 12, multiplier: 10, discountInfo: "Two months free"}
			];

			const handlePurchaseOptions = (event: React.SyntheticEvent, value: any): void => {
				const durationText = value && value?.durationText as string;
				const duration = value && value?.duration as number;
				const multiplier = value && value?.multiplier as number;
				const dscountInfo = value && value?.discountInfo as string;
				setPurchaseDialogProps({
					...purchaseDialogProps,
					userSubscription: {
						...purchaseDialogProps.userSubscription,
						durationText: durationText,
						duration: duration,
						multiplier: multiplier,
						discountInfo: dscountInfo
					}
				});
			};

			const handleRenewSubscriptionToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
				setRenew(event.target.checked);
				if (event.target.checked) {
					setPurchaseDialogProps({
						...purchaseDialogProps,
						userSubscription: {
							...purchaseDialogProps.userSubscription,
							autoRenewMessage: "Your subscription will renew automatically"
						}
					});
				} else {
					setPurchaseDialogProps({
						...purchaseDialogProps,
						userSubscription: {
							...purchaseDialogProps.userSubscription,
							autoRenewMessage: ""
						}
					});
				}
			};

			const handleRemindertoggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
				setReminder(event.target.checked);

				if (event.target.checked) {
					setPurchaseDialogProps({
						...purchaseDialogProps,
						userSubscription: {
							...purchaseDialogProps.userSubscription,
							emailReminderMessage: "You will be notified when this subscription ends."
						}
					});
				} else {
					setPurchaseDialogProps({
						...purchaseDialogProps,
						userSubscription: {
							...purchaseDialogProps.userSubscription,
							emailReminderMessage: ""
						}
					});
				}
			};

			return(
				<Grid container spacing={-5}>
					<Grid item xs={4}>
						<Autocomplete
							disablePortal
							openOnFocus
							disableClearable
							onChange={ handlePurchaseOptions }
							options={purchaseOptions}
							getOptionLabel={(option) => option.durationText}
							isOptionEqualToValue={(option, value) => option.durationText === value.durationText}
							sx={{width: 200}}
							renderInput={(params: any) => <TextField {...params} label="Duration" />}
						/>
					</Grid>
					<Grid item xs={4}>
						<Stack direction="column" spacing={2}>
							<Typography variant="subtitle2">Enable auto renew</Typography>
							<Switch
								disabled
								checked={renew}
								color="secondary"
								onChange={ handleRenewSubscriptionToggle }
							/>
							<Typography variant="subtitle2">Enable reminders</Typography>
							<Switch
								disabled
								checked={reminder}
								color="secondary"
								onChange={handleRemindertoggle }
							/>
						</Stack> 
					</Grid>
					<Grid item xs={4}>
						<BasicCard
							// cardSX={{width: "15rem", height: "20rem"}}
							actionArea={false}
							content={
								<Box>
									<Typography variant="h5" align="center" gutterBottom>
										<strong>
											{ purchaseDialogProps.userSubscription.subscription } 
										</strong>
									</Typography>
									<Divider />
									<Typography variant="h6">
										{purchaseDialogProps.userSubscription.subscription !== "DEMO" ? purchaseDialogProps.userSubscription.discountInfo : ""}
									</Typography>
									{renderAppCost(purchaseDialogProps.userSubscription.subscription, purchaseDialogProps.userSubscription.multiplier)}
									<Divider />
									<Typography variant="subtitle2">
										{purchaseDialogProps.userSubscription.autoRenewMessage}
									</Typography>
									<Typography variant="subtitle2">
										{purchaseDialogProps.userSubscription.emailReminderMessage}
									</Typography>
								</Box>
							}
						/>
					</Grid>
				</Grid>
			);
		};

		switch(purchaseDialogProps.activeStep) {
		// TODO Finish switch
		case 0: {
			return(
				<Stack direction="row" spacing={2}>
					{cardList}
				</Stack>
			);
		}
		case 1: {
			return(
				<Box sx={{marginLeft: 5}}>
					{ renderConfigurePlan() }
				</Box>
			);
		}
		case 2: {
			return(
				<h1>Banking</h1>
			);
		}
		case 3: {
			return(
				<h1>Finish</h1>
			);
		}
		default: {
			setPurchaseDialogProps({
				...purchaseDialogProps,
				activeStep: 0
			});
		}
		}
	};

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
	
	return (
		<Box sx={{marginLeft: "5%"}}>
			<h1>Apps</h1>
			
			<Grid container>
				{ appList }
			</Grid>
			<ContentDialog 
				maxWidth="md"
				fullScreen={ useMediaQuery(theme.breakpoints.down("sm")) }
				fullWidth={true}
				isOpen={isPurchaseDialogOpen}
				title={purchaseDialogTitle}
				closeOnClickaway={false}
				onClose={cancelPurchaseDialog}
				customActions={
					<Box>
						<Button onClick={cancelPurchaseDialog}>cancel</Button>
						<Button
							color="inherit"
							disabled={purchaseDialogProps.activeStep === 0}
							onClick={handlePurchaseDialogBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
						<Button 
							onClick={purchaseDialogNext}
							disabled={ purchaseDialogProps.userSubscription.subscription === "UNDEFINED" }
						>
							{purchaseDialogProps.activeStep === purchaseDialogProps.steps.length - 1 ? "Finish" : "Next"}
						</Button>
					</Box>
				}
				content={
					<Box>
						<BasicStepper 
							steps={purchaseDialogProps.steps}
							activeStep={purchaseDialogProps.activeStep}
						/>
						<Box sx={{marginTop: 5}}>
							{ renderStepContent() }
						</Box>
					</Box>
				}
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