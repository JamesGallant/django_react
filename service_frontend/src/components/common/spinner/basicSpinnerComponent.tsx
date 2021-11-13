import React from "react";
import { CentredSubmitFormRoot } from "../../../utils/commonStyles";

import { Box, CircularProgress } from "@mui/material";

const BasicSpinner: React.FC = (props: any): JSX.Element => {
	const { Root, classes } = CentredSubmitFormRoot("circular-progress");
	const { ...other } = props;
	return(
		<Root className = {classes.root}>
			<Box sx={{ display: "flex" }}>
				<CircularProgress 
					{...other}
				/>
			</Box>
		</Root>
	);
};

export default BasicSpinner;