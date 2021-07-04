import React, { useState, useEffect } from 'react';

import { Input, FilledInput, OutlinedInput, Zoom, IconButton, Typography, FormControl, InputLabel,
        InputAdornment, FormHelperText, Tooltip, ClickAwayListener} from '@material-ui/core';

import { ThemeProvider, } from '@material-ui/core/styles';
import {Visibility, VisibilityOff } from '@material-ui/icons';
import InfoIcon from '@material-ui/icons/Info';


import configuration from '../../utils/config';
import MuiGlobalTheme from '../../utils/themes';



const InputVariant = (props: any): JSX.Element => {
    /**
     * @description returns the correct Input element based on the variant
     */
    const { variant="", ...other } = props;

    switch(variant){
        case "outlined": return(<OutlinedInput {...other} />);
        case "filled": return(<FilledInput {...other} />);
        default: return(<Input {...other}/>)
    };
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

    const { value, fullWidth=true, onChange, errorMessage=[""], ...other } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false);

    let muiVariant:string = configuration['mui-InputVariant'];

    useEffect(() => {
        const timedTooltip = setTimeout(() => {
            if (openTooltip) {
                setOpenTooltip(false);
            }
        }, 8000)

        return () => clearTimeout(timedTooltip)
    }, [openTooltip])

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };

    const HandleClickAway = () => {
        setOpenTooltip(false)
    };
    
    const handleToggleTooltip = () => {
        setOpenTooltip(!openTooltip);
    };

    return(
        <FormControl fullWidth={ fullWidth } >
        <ThemeProvider theme={MuiGlobalTheme}>
            <InputLabel>Password</InputLabel>
        </ThemeProvider>
            <InputVariant   variant={ muiVariant }
                            label="Password"
                            name="password"
                            value = { value }
                            onChange = { onChange }
                            type = { showPassword ? 'text': 'password'}
                            error = { errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                            aria-label="toggle-pw-visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            onMouseDown={handleMouseDown}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                    <ClickAwayListener onClickAway={HandleClickAway}>
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
                                                interactive
                                                open={openTooltip}
                                                TransitionComponent={Zoom}
                                                placement="right"
                                                >
                                            <IconButton
                                                    aria-label="display-pw-info"
                                                    onMouseDown={handleMouseDown}
                                                    onClick = {handleToggleTooltip}
                                                    >
                                                <InfoIcon />
                                            </IconButton >
                                        </Tooltip>
                                    </ClickAwayListener>
                                </InputAdornment>
                            }
                            {...other} 
                            />
            <FormHelperText error={ errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }>
                    { errorMessage.join(' ') }
                </FormHelperText>
        </FormControl>
    );
};

export default PasswordField;