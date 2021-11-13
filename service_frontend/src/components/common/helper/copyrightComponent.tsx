import React, { FC } from "react";
import { Typography } from "@mui/material";


const Copyright: FC = () => {
	return(
		<Typography variant="body2" color="textSecondary" align="center">
        Copyright ©
			<a href="/">
				{ process.env.REACT_APP_SITE_NAME }
			</a>
			{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

export default Copyright;