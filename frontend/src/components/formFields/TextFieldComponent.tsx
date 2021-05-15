import React from 'react';
import { TextField as MuiTextField }from "@material-ui/core";

import FormValidator from '../../utils/validators'

const TextField = (props: any) => {
   const { name, label, id, value, onChange, validate="", didSubmit, ...other } = props;
   let validator = new FormValidator(validate)
   let errorMessage = validator.validate(value)

   const checkValidatorErr = (err: string): boolean => {
       return(err === "" ? false: true)
   };

   const handleErr = (): boolean => {
       if (didSubmit) {
           return(checkValidatorErr(errorMessage))
       } else {
           return(false)
       };
   };

   const handleHelper = (): string => {
       if (didSubmit) {
           return(errorMessage)
       } else {
           return("")
       };
   };

    return(
        <MuiTextField
         name={name}
         label={label}
         id={id}
         value={value}
         onChange={onChange}
         error={ handleErr() }
         helperText={ handleHelper() }
         {...other}
        />
    );
};

export default TextField;