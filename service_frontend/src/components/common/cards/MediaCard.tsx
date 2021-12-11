import React from "react";
import {Card, CardContent, CardActions, CardMedia} from "@mui/material";

const MediaCard = (props: any): JSX.Element => {
	const validMedia = ["video", "audio", "picture", "iframe", "img"];
	const { cardSx, mediaSx, mediaHeight, mediaComponent, mediaAlt, mediaSrc=null, mediaImage=null,
		cardContentElements, cardActionElements } = props;
	
	if(!validMedia.includes(mediaComponent)) {
		throw new Error(`mediaComponent ${mediaComponent} is not a valid component, choose one of these ${validMedia}`);
	}

	return(
		<Card sx={cardSx}>
			{mediaSrc === null ? 
				<CardMedia 
					image={mediaImage}
					component={mediaComponent}
					height={mediaHeight}
					sx={mediaSx}
					alt={mediaAlt}
				/> : 
				<CardMedia 
					src={mediaSrc}
					component={mediaComponent}
					height={mediaHeight}
					sx={mediaSx}
					alt={mediaAlt}
				/>}
			<CardContent>
				{cardContentElements}
			</CardContent>
			<CardActions>
				{cardActionElements}
			</CardActions>
		</Card >
	);
};

export default MediaCard;