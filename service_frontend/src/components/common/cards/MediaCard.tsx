import React from "react";
import { Card, CardContent, CardActions, CardMedia, CardActionArea } from "@mui/material";
import type { SxProps } from "@mui/system";

interface MediaCardPropsInterface {
	cardSx?: SxProps
	mediaSx?: SxProps
	actionAreaSx?: SxProps
	mediaHeight?: string | number
	mediaComponent: any
	mediaAlt?: string
	mediaSrc: string
	disabled?: boolean
	raised?: boolean
	cardContentElements?: JSX.Element
	cardActionElements?: JSX.Element
	onCardClick?: () => void
}

const MediaCard = (props: MediaCardPropsInterface): JSX.Element => {
	const validMedia = ["video", "audio", "picture", "iframe", "img"];
	const { cardSx, mediaSx, actionAreaSx, mediaHeight, mediaComponent, mediaAlt, disabled=false, mediaSrc="", 
		raised=false, cardContentElements, cardActionElements, onCardClick } = props;
	
	if(!validMedia.includes(mediaComponent)) {
		throw new Error(`mediaComponent ${mediaComponent} is not a valid component, choose one of these ${validMedia}`);
	}

	return(
		<Card 
			raised={raised} 
			sx={cardSx}
		>
			<CardActionArea
				sx={actionAreaSx}
				disabled={disabled}
				onClick={onCardClick}
			>
				<CardMedia 
					src={mediaSrc}
					component={mediaComponent}
					height={mediaHeight}
					sx={mediaSx}
					alt={mediaAlt}
				/>
				<CardContent>
					{cardContentElements}
				</CardContent>
			</CardActionArea>
			<CardActions>
				{cardActionElements}
			</CardActions>
		</Card >
	);
};

export default MediaCard;