import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

interface StepperPropsInterface {
	steps: Array<string>
	activeStep: number
}
const BasicStepper = (props: StepperPropsInterface): JSX.Element => {
	
	return(
		<Stepper alternativeLabel activeStep={props.activeStep}>
			{props.steps.map((label) => (
				<Step key={label}>
					<StepLabel>{label}</StepLabel>
				</Step>
			))}
		</Stepper>
	);
};

export default BasicStepper;