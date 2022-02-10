import React from "react";

import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { selectAppData } from "../../../../store/slices/registeredAppsSlice";
import { selectPurchaseDialogData, setConfiguration } from "../../../../store/slices/purchaseDialogSlice";

import { Box, Grid, Autocomplete, TextField, Typography, Divider } from "@mui/material";

import BasicCard from "../../../common/cards/basicCard";

import type { PurchaseDialogData, configurationInterface } from "../../../../types/purchaseDialogTypes";
import { AppPagedInterface } from "../../../../types/applicationTypes";

interface ConfigurationProps {
	appID: number
}

const ConfigureStep = (props: ConfigurationProps): JSX.Element => {
	const dispatch = useAppDispatch();

	const dialogData: PurchaseDialogData = useAppSelector(selectPurchaseDialogData);
	const registeredApps: AppPagedInterface = useAppSelector(selectAppData);
	const currentApp = registeredApps.results?.find(app => app.id === props.appID);

	const renderConfigurePlan = (): JSX.Element => {
		const purchaseOptions= [
			{durationText: "1 month", duration: 1, multiplier: 1, discountInfo: ""},
			{durationText: "6 months", duration: 6, multiplier:  5, discountInfo: "One month free"},
			{durationText: "1 year", duration: 12, multiplier: 10, discountInfo: "Two months free"}
		];

		const handlePurchaseOptions = (event: React.SyntheticEvent, value: any): void => {
			dispatch(setConfiguration({
				duration: value && value?.duration as number,
				durationText: value && value?.durationText as string,
				multiplier: value && value?.multiplier as number,
				discountInfo: value && value?.discountInfo as number
			}));
		};

		const renderAppCost = (): JSX.Element => {
			switch(dialogData.data.selectedSubscription) {
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
						{currentApp?.basic_cost === 0.00 ? 
							<Typography variant="h5" align="center" gutterBottom>
								FREE
							</Typography> :
							<Box>
								{dialogData.data.configuration.multiplier === 0 ? 
									<Grid container>
										<Grid item xs={12}>
											<Typography variant="h5" align="center">
												{currentApp?.basic_cost_currency} {currentApp?.basic_cost}
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
										{currentApp?.basic_cost_currency} {(currentApp?.basic_cost as number * dialogData.data.configuration.multiplier).toFixed(2)}
									</Typography>
								}
							</Box>
						}
					</Box>
				);
			}
			case "PREMIUM": {
				return(
					<Box>
						{currentApp?.premium_cost === 0.00 ? 
							<Typography variant="h5" align="center" gutterBottom>
								FREE
							</Typography> :
							<Box>
								{dialogData.data.configuration.multiplier === 0 ? 
									<Grid container>
										<Grid item xs={12}>
											<Typography variant="h5" align="center">
												{currentApp?.premium_cost_currency} {currentApp?.premium_cost}
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
										{currentApp?.premium_cost_currency} {(currentApp?.premium_cost as number * dialogData.data.configuration.multiplier).toFixed(2)}
									</Typography>
								}
							</Box>
						}
					</Box>
				);
			}
			case "UNDEFINED": {
				return <div />;
			}
			default: {
				throw new Error(`Expected subscription to equal (DEMO, BASIC or PREMIUM) but recieved ${dialogData.data.selectedSubscription}`);
			}
			}
		};

		return(
			<Grid container spacing={12}>
				<Grid item xs={6}>
					<Autocomplete
						disablePortal
						openOnFocus
						disableClearable
						onChange={ handlePurchaseOptions }
						options={purchaseOptions}
						getOptionLabel={(option: configurationInterface) => option.durationText}
						isOptionEqualToValue={(option: configurationInterface, value: configurationInterface) => option.durationText === value.durationText}
						sx={{width: 200}}
						renderInput={(params: any) => <TextField {...params} label="Duration" />}
					/>
				</Grid>
				<Grid item xs={6}>
					<BasicCard
						cardSX={{width: "15rem", height: "20rem"}}
						actionArea={false}
						raised={true}
						content={
							<Box>
								<Typography variant="h5" align="center" gutterBottom>
									<strong>
										{ dialogData.data.selectedSubscription} 
									</strong>
								</Typography>
								<Divider />
								<Typography variant="h6">
									{dialogData.data.configuration.discountInfo}
								</Typography>
								{ renderAppCost() }
								<Divider />
							</Box>
						}
					/>
				</Grid>
			</Grid>
		);
	};

	return(
		<Box sx={{marginLeft: 5}}>
			{ renderConfigurePlan() }
		</Box>
	);
};

export default ConfigureStep;