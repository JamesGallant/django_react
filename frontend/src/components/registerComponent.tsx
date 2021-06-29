// react
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

// material ui
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


// third party
import parsePhoneNumber from 'libphonenumber-js';

// own
import Copyright from './copyrightComponent'; 
import TextField from './formFields/TextFieldComponent';
import PasswordField from './formFields/passwordComponent';
import CountrySelect from './formFields/countryComponent';
import configuration from '../utils/config';

import { accountsClient } from "../utils/APImethods";


const useStyles = makeStyles((theme) => ({
    root: {
    position: 'absolute',
    flexGrow: 1, 
    left: '50%', 
    top: '50%',
    transform: 'translate(-50%, -50%)'
},
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface FormTypes {
    firstName: string,
    lastName: string,
    country: string,
    mobileNumber: string,
    email: string,
    password: string
};

const initialVals: FormTypes = {
    firstName: "",
    lastName: "",
    country: "",
    mobileNumber: "",
    email: "",
    password: ""
};

interface ErrMessageTypes {
    firstName: string[],
    lastName: string[],
    email: string[], 
    mobile: string[],
    country: string[],
    password: string[],
};

const initialErrs: ErrMessageTypes = {
    firstName: [""],
    lastName: [""],
    email: [""], 
    mobile: [""],
    country: [""],
    password: [""],

};

export default function SignUp() {
/**
 *@Description component signs up a user by submitting a post request to the authentication server with the required fields. The mobile_number 
 * number must be edited to reflect the correct country by use of the country selector. 
 *
 *@Resource https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
 *@Resource https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-create
 */

const classes = useStyles();
const history = useHistory();

const [formValues, setFormValues] = useState(initialVals);
const [countryCode, setCountryCode] = useState("");
const [errorMessage, setErrorMessage] = useState(initialErrs)

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
   
    setFormValues({
        ...formValues,
        [name]: value,
    });
};

const handleCountryData = (event: React.ChangeEvent<HTMLInputElement>, value: {code: string, label: string, phone: string}) => {

    const label = value && value.label 
    const code = value && value.code
    if (label === null) {
        setCountryCode("");

        setFormValues({
            ...formValues,
            country: "",
        });

        } else {
            setCountryCode(code);

            setFormValues({
                ...formValues,
                country: label,
            });
        
        }
};


const  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let client = new accountsClient()
    const country: any = countryCode
    const parsedPhoneNumber = parsePhoneNumber(formValues.mobileNumber, country)

    var phonenumber = formValues.mobileNumber
    if (parsedPhoneNumber) {
         phonenumber = parsedPhoneNumber.number.toString()
     } 
    
    const userData = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        mobile_number: phonenumber,
        email: formValues.email,
        country: formValues.country,
        password: formValues.password
    };
    
    const registerNewAccount = client.registerUser(userData)
    registerNewAccount.then((res) => {
        switch(res.status) {
            case 201:
                //account creation successfull
                history.push(configuration["url-createAccount"], {
                    email: formValues.email,
                    firstName: formValues.firstName,
                });
                break;
            case 400:
                // account creation failed
                setErrorMessage({
                    firstName: typeof(res.data!.first_name) === "undefined" ? [""]:  res.data!.first_name,
                    lastName: typeof(res.data!.last_name) === "undefined" ? [""]:  res.data!.last_name,
                    email: typeof(res.data!.email) === "undefined" ? [""]: res.data!.email,
                    mobile: typeof(res.data!.mobile_number) === "undefined" ? [""]: res.data!.mobile_number,
                    country: typeof(res.data!.country) === "undefined" ? [""]: res.data!.country,
                    password: typeof(res.data!.password) === "undefined" ? [""]: res.data!.password,
                });
                break;

            default:
                throw new Error("Status code invalid, should be 400 or 201. See https://djoser.readthedocs.io/en/latest/base_endpoints.html#user-create")
        };
    });
};

return (
<div className={classes.root} >
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div className={classes.paper}>
        <Typography component="h1" variant="h5">
        Register your account
        </Typography>
        
        <form className={classes.form} noValidate={true} onSubmit= { submit }>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    name="firstName"
                    id="fname"
                    label="First Name"
                    fullWidth
                    required
                    value={ formValues.firstName }
                    onChange={ handleChange }
                    errorMessage={ errorMessage.firstName }
                    
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="lname"
                    name="lastName"
                    label="Last Name"
                    value={ formValues.lastName }
                    onChange={ handleChange }
                    errorMessage={ errorMessage.lastName }
                    
                />
            </Grid>
            <Grid item xs={12} sm={6}>
            <CountrySelect onChange={handleCountryData} 
                           errorMessage = { errorMessage.country }
                            />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="mobileNumber"
                    name="mobileNumber"
                    label="mobile number"
                    value={ formValues.mobileNumber }
                    onChange={ handleChange }
                    errorMessage={ errorMessage.mobile }
                />
            </Grid>
            <Grid item xs={12} >
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={ formValues.email }
                    onChange={ handleChange }
                    errorMessage={ errorMessage.email }
                    
                />
            </Grid>
            <Grid item xs={12} >
                    <PasswordField
                    id="password"
                    value={ formValues.password }
                    errorMessage={ errorMessage.password }
                    onChange={ handleChange }/>
            </Grid>
        </Grid>
        <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
        >
            Sign Up
        </Button>
        <Grid container justify="flex-end">
            <Grid item>
            <Link href={configuration["url-login"]} variant="body2">
                Already have an account? Sign in
            </Link>
            </Grid>
        </Grid>
        </form>
    </div>
    <Box mt={5}>
        <Copyright />
    </Box>
    </Container>
</div>
);
};