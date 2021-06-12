import React from 'react';

//third party
import { TextField as MuiTextField }from "@material-ui/core";

//ours
import FormValidator from '../../utils/validators';
import configuration from '../../utils/config';
import HandleErrors from '../../utils/FormErrors';



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

   let muiVariant = configuration['mui-InputVariant']
   
   const { name, label, id, value, onChange, didSubmit, validate="", ...other } = props;

   let validator = new FormValidator(validate)
   let errorMessage = validator.validate(value)

   let handler = new HandleErrors(didSubmit, errorMessage)

    return(
        <MuiTextField
            variant={ muiVariant }
            name={name}
            label={label}
            id={id}
            value={value}
            onChange={onChange}
            error={ handler.handleErr() }
            helperText={ handler.handleHelper() }
            {...other}
        />
    );
};

export default TextField;