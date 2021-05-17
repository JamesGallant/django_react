import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Input, FilledInput, OutlinedInput } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
        marginLeft: theme.spacing(2),
    },
  }),
);


const InputVariant = (props: any): JSX.Element => {
    /**
     * @description returns the correct Input element based on the variant
     */
    const { variant="", ...rest } = props;

    switch(variant){
        case "outlined": return(<OutlinedInput {...rest} />);
        case "filled": return(<FilledInput {...rest} />);
        default: return(<Input {...rest}/>)
    };
};

const PasswordField = (props: any): JSX.Element => {
    /**
     * @Description Password form with error handling and toggling the display using a icon button
     * 
     * @Resource https://material-ui.com/components/text-fields/
     * 
     * @param props: Props from JSX element
     * @returns JSX.Element
     */

    const classes = useStyles();

    return(
        <FormControl >
            <InputLabel className={classes.input}  htmlFor="outlined-adornment-password">Password</InputLabel>
            <InputVariant variant="outlined" label="Password" />
        </FormControl>
    );
};

export default PasswordField