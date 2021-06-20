import React, {useState} from "react";
import { TextField as MuiTextField }from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import countries from "../../utils/countryData";


interface CountryType {
    code: string;
    label: string;
    phone: string;
  }

function countryToFlag(isoCode: string) {
    return typeof String.fromCodePoint !== 'undefined'
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      : isoCode;
  }
  
const useStyles = makeStyles({
    option: {
      fontSize: 15,
      '& > span': {
        marginRight: 10,
        fontSize: 18,
      },
    },
  });


export default function CountrySelect(props:any): JSX.Element {

    const { onChange, errorMessage=[""] } = props;
    const classes = useStyles();
    const [country, setCountry] = useState("");
    
    return (
      <Autocomplete
        id="select-country"
        options={countries as CountryType[]}
        classes={{
          option: classes.option,
        }}
        autoHighlight
        inputValue={country}
        onChange={ onChange }
        onInputChange = {(event: object, value: string) => { setCountry(value) }}
        getOptionLabel={(option) => option.label}
        renderOption={(option) => (
          <React.Fragment>
            <span>{countryToFlag(option.code)}</span>
            {option.label} 
          </React.Fragment>
        )}
        renderInput={(params) => (
          <MuiTextField
            onChange={onChange}
            variant="outlined"
            {...params}
            label="Country"
            error={ errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }
            helperText={ errorMessage.join(' ') }
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    );
  }
  