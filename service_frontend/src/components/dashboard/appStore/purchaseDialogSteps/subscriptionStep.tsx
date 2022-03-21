import React from "react";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setSelectedSubscription, selectPurchaseDialogData } from "../../../../store/slices/purchaseDialogSlice";
import { selectAppData } from "../../../../store/slices/registeredAppsSlice";

import { Box, Typography, Divider, Button, Grid } from "@mui/material";

import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";

import BasicCard from "../../../common/cards/basicCard";
import IconList from "../../../common/Lists/iconList";

import type { AppPagedInterface, subscriptionOptions } from "../../../../types/applicationTypes";
import type { subscriptionCardSelection, PurchaseDialogData } from "../../../../types/purchaseDialogTypes";

interface SubscriptionStepInterface {
	appID: number
}

interface subscriptionCardUnion  {
	demo: string | boolean
	basic: string | boolean
	premium: string | boolean
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

const SubscriptionStep = (props: SubscriptionStepInterface): JSX.Element => {

	const registeredApps: AppPagedInterface = useAppSelector(selectAppData);
	const dialogData: PurchaseDialogData = useAppSelector(selectPurchaseDialogData);

	const dispatch = useAppDispatch();
	const currentApp = registeredApps.results?.find(app => app.id === props.appID);

	const appContent = {
		description: {
			demo: currentApp?.demo_app_description,
			basic: currentApp?.basic_app_description,
			premium: currentApp?.premium_app_description
		},
		value: {
			basic: {
				currency: currentApp?.basic_cost_currency,
				cost: currentApp?.basic_cost
			},
			premium: {
				currency: currentApp?.premium_cost_currency,
				cost: currentApp?.premium_cost
			}
		}
	};

	const cardList = currentApp?.subscription_type.split("|").map((value, index) => {
		const sub = value as subscriptionOptions;
		const renderAppCost = (subscription: string, multiplier=0): JSX.Element => {
			const costTypography = (selector: string): JSX.Element => {
				
				const costToPurchase = appContent.value[selector as keyof AppValueInterface].cost as number;

				return(
					<div>
						{multiplier === 0 ? 
							<Grid container>
								<Grid item xs={12}>
									<Typography variant="h5" align="center">
										{appContent.value[selector as keyof AppValueInterface].currency} {costToPurchase}
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
								{appContent.value[selector as keyof AppValueInterface].currency} { (costToPurchase * multiplier).toFixed(2) }
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
						{appContent.value.basic.cost === 0.00 ? 
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
						{appContent.value.premium.cost === 0.00 ? 
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

		const cardDescriptions = appContent.description[sub.toLowerCase() as keyof subscriptionCardUnion]?.split("|").map((item, index) => {
			return(
				<IconList 
					key={index} 
					dense={false} 
					primaryText={item} 
					icon={<CheckCircleOutlineSharpIcon />} 
					iconSX={{ color: "primary.main" }}/>
			);
		});
		
		return (
			<Grid item  key={index} columns={{ xs: 4, sm: 8, md: 12 }}>
				<BasicCard
					cardSX={{ border: dialogData.data.cardSelection[sub.toLowerCase() as keyof subscriptionCardSelection ] ? 2 : 0, 
						borderColor: dialogData.data.cardSelection[sub.toLowerCase() as keyof subscriptionCardSelection] ? "secondary.main": null,
						width: "15rem", height: "22rem", padding: "1rem", position: "relative" }}
					actionArea={false}
					raised={true}
					content={
						<Box>
							<Grid container>
								<Grid item xs={12}>
									<Typography variant="h5" align="center" gutterBottom><strong>{sub}</strong></Typography>
									<Divider variant="middle" sx={{ marginBottom: 2 }}/>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="h5" align="center" gutterBottom>
										<strong>{renderAppCost(sub)}</strong>
									</Typography>
									<Divider variant="middle" sx={{ marginBottom: 2 }}/>
								</Grid>
								<Grid item xs={12}>
									<Box sx={{ maxHeight: "9rem", overflow: "auto" }}>
										{ cardDescriptions }
									</Box>
								</Grid>
							</Grid>
						</Box>
					}
					actions={
						<Box>
							<Button 
								onClick={() => dispatch(setSelectedSubscription(sub)) } 
								variant="outlined"
								sx={{ bottom: "1rem", position: "absolute" }}
								disabled={dialogData.data.cardSelection[sub.toLowerCase() as keyof subscriptionCardSelection ] ? true : false }
							> 
									Select plan
							</Button>
						</Box>
					}
				/>
			</Grid>
		);
	});

	return(
		<Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
			{cardList}
		</Grid>
	);
};

export default SubscriptionStep;