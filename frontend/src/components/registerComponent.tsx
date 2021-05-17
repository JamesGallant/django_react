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

// axios
import axios from 'axios';

// own
import Copyright from './copyrightComponent'; 
import TextField from './formFields/TextFieldComponent'
import PasswordField from './formFields/passwordComponent'

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
    //country: string,
    mobileNumber: string,
    email: string,
    password: string
};

const initialVals: FormTypes = {
    firstName: "",
    lastName: "",
    //country: "",
    mobileNumber: "",
    email: "",
    password: ""
};

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

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues({
        ...formValues,
        [name]: value,
    });
};

// need to fix this
const  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let userData = JSON.stringify({
        ...formValues
    })
    
    if (true){
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
                name="firstName"
                id="firstName"
                label="First Name"
                autoFocus
                fullWidth
                required
                value={ formValues.firstName }
                onChange={ handleChange }
                didSubmit={true}
                validate="noEmptyFields"
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={ formValues.lastName }
                onChange={ handleChange }
                validate="noEmptyFields"
            />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                validate="noEmptyFields"
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={ formValues.email }
                onChange={ handleChange }
                validate="noEmptyFields"
            />
            </Grid>
            <Grid item xs={12}>
                <PasswordField />
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