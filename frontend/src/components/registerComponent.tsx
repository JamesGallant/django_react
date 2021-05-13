// react
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

// material ui
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// axios
import axios from 'axios';

// own
import Copyright from './copyrightComponent'; 


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
    first_name: string,
    last_name: string,
    //country: string,
    mobile_number: string,
    email: string,
    password: string
};

interface errTypes {
    first_name: boolean,
    last_name: boolean,
    //country: boolean,
    mobile_number: boolean,
    email: boolean,
    password: boolean
};

const initialVals: FormTypes = {
    first_name: "",
    last_name: "",
    //country: "",
    mobile_number: "",
    email: "",
    password: ""
};

const initialErrs: errTypes = {
    first_name: false,
    last_name: false,
    //country: false,
    mobile_number: false,
    email: false,
    password: false
}

export default function SignUp() {
/**
 *@Description component signs up a user by submitting a post request to the authentication server with the required fields. The mobile_number 
 * number must be edited to reflect the correct country by use of the country selector. 
 *
 *@Resource https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
 */

const classes = useStyles();
const history = useHistory();

const [formValues, setFormValues] = useState(initialVals);
const [errValues, setErrValues] = useState(initialErrs);
const [errText, setErrText] = useState(initialVals)

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues({
        ...formValues,
        [name]: value,
    });

    setErrValues({
        ...errValues,
        [name]: false,
    });

    setErrText({
        ...errText,
        [name]: "",
    })
};

const validate = () => {
    let tempErrText = {
        "first_name": formValues.first_name ? "": "This Field is required",
        "last_name": formValues.last_name ? "": "This Field is required",
        "mobile_number":  formValues.mobile_number.length > 7 ? "": "Not a valid mobile_number number",
        "email": (/^[^\s@]+@[^\s@]+$/).test(formValues.email) ? "": "Not a valid email address",
        //"country": formValues.country ? "": "This Field is required",
        "password": formValues.password ? "": "This Field is required",
    };

    let tempErrVals = {
        "first_name": formValues.first_name==="" ? true: false,
        "last_name":  formValues.last_name==="" ? true: false,
        "mobile_number":  formValues.mobile_number.length < 7  ? true: false,
        "email":  (/^[^\s@]+@[^\s@]+$/).test(formValues.email) ? false: true,
        //"country": formValues.country==="" ?true: false,
        "password": formValues.password==="" ?true: false,
    };


    setErrText({
        ...tempErrText
    });

    setErrValues({
        ...tempErrVals
    });


    return(Object.values(tempErrText).every(x => x===""))
}

const  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let userData = JSON.stringify({
        ...formValues
    })
    
    if (validate()){
        axios({
            method: "post",
            data: userData,
            url: 'http://localhost:8001/api/v1/auth/users/',
            headers: {
                'Content-Type': 'application/json',
            }
          })
          .then(function (response) {
            var userdata = response.data;
            console.log(userdata)
            history.push("/login")
        })
        .catch(function (error) {
            alert(error)
          });
    }
    else {
        alert('invalid entry')
    } 
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
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                id="first_name"
                label="First Name"
                autoFocus
                fullWidth
                required
                value={ formValues.first_name }
                onChange={ handleChange }
                error={errValues.first_name}
                helperText={errText.first_name}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                variant="outlined"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="lname"
                value={ formValues.last_name }
                onChange={ handleChange }
                error={errValues.last_name}
                helperText={errText.last_name}
                
            />
            </Grid>
            
            <Grid item xs={12} sm={6}>
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                variant="outlined"
                required
                fullWidth
                id="mobile_number"
                label="mobile_number"
                name="mobile_number"
                value={ formValues.mobile_number }
                onChange={ handleChange }
                error={errValues.mobile_number}
                helperText={errText.mobile_number}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={ formValues.email }
                onChange={ handleChange }
                error={errValues.email}
                helperText={errText.email}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={ formValues.password }
                onChange={ handleChange }
                error={errValues.password}
                helperText={errText.password}
            />
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
            <Link href="/login/" variant="body2">
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