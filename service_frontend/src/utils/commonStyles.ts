import { styled } from "@mui/material";

export const CentredSubmitFormRoot = (prefix: string) => {
	const classes = {
		root: `${prefix}-root`,
		paper: `${prefix}-paper`,
		form: `${prefix}-form`,
		submit: `${prefix}-submit`
	};
	
	const Root = styled("div")(({theme}) => ({
		[`&.${classes.root}`]: {
			position: "absolute",
			flexGrow: 1, 
			left: "50%", 
			top: "50%",
			transform: "translate(-50%, -50%)"
		},
	
		[`& .${classes.paper}`]: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			flexWrap: "wrap",
		},
	
		[`& .${classes.form}`]: {
			padding: theme.spacing(5),
		},
	
		[`& .${classes.submit}`]: {
			color: "white",
			padding: "5px",
			backgroundColor: "#0063cc",
		}
	}));

	return {
		Root,
		classes
	};
};