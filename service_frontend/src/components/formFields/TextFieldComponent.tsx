import React from "react";

//third party
import { TextField as MuiTextField }from "@material-ui/core";

//ours
import configuration from "../../utils/config";



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

	const muiVariant = configuration["mui-InputVariant"];
   
	const { name, label, id, value, onChange, errorMessage=[""], ...other } = props;

	return(
		<MuiTextField
			variant={ muiVariant }
			name={name}
			label={label}
			id={id}
			value={value}
			onChange={onChange}
			error={  errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }
			helperText={ errorMessage.join(" ") }
			{...other}
		/>
	);
};

export default TextField;