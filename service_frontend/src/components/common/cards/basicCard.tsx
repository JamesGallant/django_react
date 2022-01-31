import * as React from "react";
import {Card, CardContent, CardActions, CardActionArea } from "@mui/material";
import type { SxProps } from "@mui/system";

interface BasicCardProps {
	cardSX?: SxProps
	actionAreaSX?: SxProps
	actionArea: boolean
	raised?: boolean
	content: JSX.Element
	actions?: JSX.Element
	onCardClick?: () => void
}

const BasicCard = (props: BasicCardProps): JSX.Element => {
	return(
		<Card sx={props.cardSX} raised={props.raised}>
			{props.actionArea ? 
				<CardActionArea sx={props.actionAreaSX} onClick={props.onCardClick}>
					<CardContent>
						{props.content}
					</CardContent>
				</CardActionArea> 
				:
				<div>
					<CardContent>
						{props.content}
					</CardContent>
					<CardActions>
						{props.actions}
					</CardActions>
				</div>

			}
		</Card>
	);
};

export default BasicCard;
