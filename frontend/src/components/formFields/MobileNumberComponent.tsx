import React from "react";

import { TextField as MuiTextField }from "@material-ui/core";
import parsePhoneNumber from 'libphonenumber-js';


import FormValidator from '../../utils/validators';
import configuration from '../../utils/config';
import HandleErrors from '../../utils/FormErrors';


const MobileNumber = (props: any): JSX.Element => {
    /**
     * @Description Handles mobile phone form field. The values are edited to represent an international number
     * 
     * @param props: all props as textfield except takes a countryCode as well. 
     * @returns JSX Element
     */

     let muiVariant = configuration['mui-InputVariant']

     const { countryCode, validate, value, didSubmit, ...other } = props;
     
     const parsedPhoneNumber = parsePhoneNumber(value, countryCode)
     
     var phonenumber = value
     if (parsedPhoneNumber) {
         phonenumber = parsedPhoneNumber.number.toString()
     } 

     let validator = new FormValidator(validate)
     let errorMessage = validator.validate(phonenumber)
     let handler = new HandleErrors(didSubmit, errorMessage)

     return(
        <MuiTextField
        variant={ muiVariant }
        value={phonenumber}
        error={ handler.handleErr() }
        helperText={ handler.handleHelper() }
        {...other}
        />
    );
};

export default MobileNumber;