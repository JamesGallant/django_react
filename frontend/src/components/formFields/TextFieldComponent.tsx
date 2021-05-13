import React  from "react";

import { TextField as MuiTextField }from "@material-ui/core";
interface Props {
    name?: string,
    label?: string,
    id?: string,
    error?: any[],
};


const TextField = (props: Props) => {
   const { name, label, id, error, ...other } = props;
   console.log(props)
    return(
        <MuiTextField
         name={name}
         label={label}
         id={id}
         {...other}
        />
    );
};

export default TextField;