import React from 'react';
import { TextField as MuiTextField }from "@material-ui/core";

import FormValidator from '../../utils/validators';
import configuration from '../../utils/config'



const TextField = (props: any): JSX.Element => {
   /**
    * @description Textfield component extended from material ui. Inludes error handling internally based on validate prop
    * check resources for additional props
    * 
    * @resource https://testing-library.com/docs/react-testing-library/api
    * 
    * @param props: Input props
    * @returns JSX element
    */
   
   const { name, label, id, value, onChange, didSubmit, validate="", ...other } = props;
   let validator = new FormValidator(validate)
   let errorMessage = validator.validate(value)
   let muiVariant = configuration['mui-InputVariant']
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
        variant={ muiVariant }
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