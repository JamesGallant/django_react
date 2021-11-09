import React, { useState, useEffect } from "react";

import { Paper, Grid, Typography, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PREFIX = "FlashError";

const classes = {
	root: `${PREFIX}-root`,
	text: `${PREFIX}-text`
};

const Root = styled("div")(({theme}) => ({
	[`& .${classes.root}`]: {
		borderRadius: 20, 
		padding: 5,
		backgroundColor: "#00000000",
		borderColor: "#e30f00"
	},

	[`& .${classes.text}`]: {
		paddingLeft: theme.spacing(4),
		paddingTop: theme.spacing(0.5),
		color: "#e30f00"
	}
}));

interface propTypes  {
    message: string,
    display: boolean
}

const FlashError = (props: propTypes): JSX.Element | null => {
	const { message, display } = props;



	const [toggleDisplay, setToggleDisplay] = useState(display);

	useEffect(() => {
		setToggleDisplay(display);
	}, [display]);

	const handleFlashError = () => {
		setToggleDisplay(false);
	};
    
	const toggleError = (): JSX.Element | null => {
        
		if (toggleDisplay) {
			return (
				<Root>
					<Paper className={classes.root} variant="outlined" color="primary">
						<Grid container  justifyContent="space-between">
							<Grid item>
								<Typography className={classes.text}>
									{ message }
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<IconButton 
									size="small"
									onClick={ handleFlashError }
								>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Paper>
				</Root>
			);
		} else {
			return(null);
		}
	};

	if (display) {
		return(toggleError());
	} else 
		return(null);
};

export default FlashError;