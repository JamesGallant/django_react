import React from "react";

import { useAppSelector } from "../../../store/hooks";
import { selectPurchaseDialogData } from "../../../store/slices/purchaseDialogSlice";
import {Box, Button, useMediaQuery, Breakpoint} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import BasicStepper from "../../common/steppers/basicStepper";
import ContentDialog from "../../common/dialogs/ContentDialog";
import SubscriptionStep from "./purchaseDialogSteps/subscriptionStep";
import ConfigureStep from "./purchaseDialogSteps/configureStep";

import type { PurchaseDialogData } from "../../../types/purchaseDialogTypes";

interface PurchaseAppDialogInterface {
	isOpen: boolean
	onClose: () => void
	nextFn: () => Promise<void>
	backFn: () => void
	title?: string
	closeOnClickAway?: boolean
	maxWidth?: Breakpoint
}

const PurchaseAppDialog = (props: PurchaseAppDialogInterface): JSX.Element => {
	const {isOpen, onClose, nextFn, backFn,  title="", closeOnClickAway=false,
		maxWidth="md"} = props;

	const theme = useTheme();
	const dialogData: PurchaseDialogData = useAppSelector(selectPurchaseDialogData);

	const mainStepContent = (currentStep: number) => {
		switch (currentStep) {
		// TODO Finish switch
		case 0: {
			return(
				<SubscriptionStep 
					appID={dialogData.data.appID}
				/>
			);
		}
		case 1: {
			return(
				<ConfigureStep 
					appID={dialogData.data.appID}
				/>
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
		}
	};

	return(
		<ContentDialog 
			maxWidth={maxWidth}
			fullScreen={ useMediaQuery(theme.breakpoints.down("sm")) }
			fullWidth={true}
			isOpen={isOpen}
			title={title}
			closeOnClickaway={closeOnClickAway}
			onClose={onClose}
			customActions={
				<Box>
					<Button onClick={onClose}>cancel</Button>
					<Button
						color="inherit"
						disabled={dialogData.data.activeStep === 0}
						onClick={backFn}
						sx={{ mr: 1 }}
					>
					Back
					</Button>
					<Button 
						onClick={nextFn}
						disabled={ dialogData.data.selectedSubscription === "UNDEFINED" }
					>
						{dialogData.data.activeStep === dialogData.data.steps.length - 1 ? "Finish" : "Next"}
					</Button>
				</Box>
			}
			content={
				<Box>
					<BasicStepper 
						steps={dialogData.data.steps}
						activeStep={dialogData.data.activeStep}
					/>
					<Box sx={{marginTop: 5}}>
						{mainStepContent(dialogData.data.activeStep)}
					</Box>
				</Box>
			}
		/>
	);
};

export default PurchaseAppDialog;