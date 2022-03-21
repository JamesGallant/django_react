import React, { FC } from "react";
import { Typography } from "@mui/material";
import configuration from "../../../utils/config";

const Copyright: FC = () => {
	return(
		<Typography variant="body2" color="textSecondary" align="center">
        Copyright ©
			<a href="/">
				{ configuration["site-name"] }
			</a>
			{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

export default Copyright;