import React, { useState, useEffect } from "react";

import { Input, FilledInput, OutlinedInput, Zoom, IconButton, Typography, FormControl, InputLabel,
	InputAdornment, FormHelperText, Tooltip, ClickAwayListener} from "@mui/material";

import {Visibility, VisibilityOff } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";

import configuration from "../../utils/config";


type mouseEvent = (event: React.MouseEvent<HTMLButtonElement>) => void;
type baseEvent = () => void;

type adornmentType = {
    display: boolean, 
    openToolTip: boolean, 
    showPassword: boolean,
    handleClickAway: baseEvent,
    handleMouseDown: mouseEvent, 
    handleToggleTooltip: baseEvent,
    handleClickShowPassword: baseEvent}

const InputVariant = (props: any): JSX.Element => {
	/**
     * @description returns the correct Input element based on the variant
     */
	const { variant="", ...other } = props;

	switch(variant){
	case "outlined": return(<OutlinedInput {...other} />);
	case "filled": return(<FilledInput {...other} />);
	default: return(<Input {...other}/>);
	}
};

const displayFullAdornment = (fn: adornmentType): JSX.Element => {
	if(fn.display) {
		return(
			<InputAdornment position="end">
				<IconButton
					aria-label="toggle-pw-visibility"
					onClick={fn.handleClickShowPassword}
					edge="end"
					onMouseDown={fn.handleMouseDown}
				>
					{fn.showPassword ? <Visibility /> : <VisibilityOff />}
				</IconButton>
				<ClickAwayListener onClickAway={fn.handleClickAway}>
					<Tooltip title={
						<React.Fragment>
							<Typography color="inherit"><u>Password Requirements</u></Typography>
							<Typography variant="body1">
								<li>At least 8 characters.</li>
								<li>Can’t be too similar to your other personal information.</li>
								<li>No common passwords</li>
								<li>Must be alphanumerical</li>
							</Typography>
						</React.Fragment>
					} 
					open={fn.openToolTip}
					TransitionComponent={Zoom}
					placement="right"
					>
						<IconButton
							aria-label="display-pw-info"
							onMouseDown={fn.handleMouseDown}
							onClick = {fn.handleToggleTooltip}
						>
							<InfoIcon />
						</IconButton >
					</Tooltip>
				</ClickAwayListener>
			</InputAdornment>
		);
	} else {
		return(        
			<InputAdornment position="end">
				<IconButton
					aria-label="toggle-pw-visibility"
					onClick={fn.handleClickShowPassword}
					edge="end"
					onMouseDown={fn.handleMouseDown}
				>
					{fn.showPassword ? <Visibility /> : <VisibilityOff />}
				</IconButton>
			</InputAdornment>
		);
	}
};

const PasswordField = (props: any): JSX.Element => {
	/**
     * @Description Password form with error handling and toggling the display using a icon button
     * 
     * @Resource https://material-ui.com/components/text-fields/
     * 
     * @param props: Props from JSX element
     * @param propChildren: - value => Value from top level function, i.e. the password.
     *                      - onChange, the change function from the parent
     *                      
     * @returns JSX.Element
     */

	const { value, fullWidth=true, onChange, showTooltip, inputLabel=null, errorMessage=[""], ...other } = props;

	const [showPassword, setShowPassword] = useState(false);
	const [openTooltip, setOpenTooltip] = useState(false);

	const muiVariant:string = configuration["mui-InputVariant"];

	useEffect(() => {
		const timedTooltip = setTimeout(() => {
			if (openTooltip) {
				setOpenTooltip(false);
			}
		}, 8000);

		return () => clearTimeout(timedTooltip);
	}, [openTooltip]);

	const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const HandleClickAway = () => {
		setOpenTooltip(false);
	};
    
	const handleToggleTooltip = () => {
		setOpenTooltip(!openTooltip);
	};

	const adornmentData = {
		display: showTooltip, 
		openToolTip: openTooltip, 
		showPassword: showPassword,
		handleClickAway: HandleClickAway,
		handleMouseDown: handleMouseDown, 
		handleToggleTooltip: handleToggleTooltip,
		handleClickShowPassword: handleClickShowPassword
	};

	return(
		<FormControl fullWidth={ fullWidth } >	
			<InputLabel variant="outlined">{inputLabel === null ? "Password": inputLabel}</InputLabel>
			<InputVariant   
				variant={ muiVariant }
				label="Password"
				name="password"
				fullWidth
				value = { value }
				onChange = { onChange }
				type = { showPassword ? "text": "password"}
				error = { errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }
				endAdornment={ displayFullAdornment(adornmentData) }
				{...other} 
			/>
			<FormHelperText error={ errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }>
				{ errorMessage.join(" ") }
			</FormHelperText>
		</FormControl>
	);
};

export default PasswordField;