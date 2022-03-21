import React from "react";

import { Box, Typography, Stack, Button } from "@mui/material"; 
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";

interface PurchaseButtonInterface {
	disabled: boolean
	purchased: boolean
	onClick: () => void
}

const PurchaseButton = (props: PurchaseButtonInterface): JSX.Element => {
	return(
		<Box>
			{props.disabled ? 
				<Typography variant="subtitle2" color="info">
					<strong>Coming Soon</strong>
				</Typography>
				:
				props.purchased ? 
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography variant="subtitle2" color="text.secondary" sx={{ wordWrap: "break-word" }}>
							<strong>OWNED</strong>
						</Typography>
						<CheckCircleOutlineSharpIcon 
							color="success"
						/>
					</Stack>
					:
					<Button onClick={ props.onClick } >Purchase</Button>
			}
		</Box>
	);
};

export default PurchaseButton;