import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { SxProps } from "@mui/system";

interface IconListProps {
	primaryText: string
	icon: JSX.Element
	secondaryText?: string
	dense?: boolean
	iconSX?: SxProps
}

const IconList = (props: IconListProps): JSX.Element => {
	return(
		<List dense={false}>
			<ListItem>
				<ListItemIcon sx={props.iconSX}>
					{props.icon}
				</ListItemIcon>
				<ListItemText primary={props.primaryText} secondary={props.secondaryText === undefined ? null : props.secondaryText} />
			</ListItem>
		</List>
	);
};

export default IconList;