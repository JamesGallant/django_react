import React, { FC, useEffect } from "react";

import { Grid, styled } from "@mui/material";

import configuration from "../../utils/config";
import { login } from "../../modules/authentication";

const PREFIX = "HomeView";

const classes = {
	root: `${PREFIX}-root`
};

const Root = styled("div")(({ theme }) => ({
	[`&.${classes.root}`]: {
		padding: theme.spacing(5),
	}
}));

const HomeView: FC = () => {
	useEffect(() => {
		login();
	}, []);

	return (
		<Root className={classes.root}>
			<Grid>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<a href={ configuration["url-register"] }> Register </a>
					</Grid>
					<Grid item xs={12}>
						<a href={ configuration["url-login"] }>Login </a>
					</Grid>
				</Grid>
			</Grid>
		</Root>
	);
};

export default HomeView;