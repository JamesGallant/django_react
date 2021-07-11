import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';

import TextField from './formFields/TextFieldComponent';
import PasswordField from './formFields/passwordComponent';
import Copyright from './copyrightComponent';

import configuration from '../utils/config';
import { accountsClient } from '../utils/APImethods';
import { useState } from 'react';

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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
}))

interface formTypes {
    email: string,
    password: string,
};

interface errTypes {
    email: string[],
    password: string[],
};

interface tokenTypes {
    storeToken: boolean, 
    token: string
}

const initialFormVals: formTypes = {
    email: "",
    password: "",
};

const initialErrs: errTypes = {
    email: [""],
    password: [""],
};

const initialTokenVals: tokenTypes = {
    storeToken: false,
    token: ""
};

const Login = () => {
    /**
     * @description Component that handles the login logic. Sends a request to the accounts backend for a token.
     * API endpoint requires email and password and returns [status] and token or [errors]
     * @resource securely saving auth tokens: https://www.rdegges.com/2018/please-stop-using-local-storage/
     */

    const classes = useStyles();
    const [formValues, setFormValues] = useState(initialFormVals);
    const [errorMessage, setErrorMessage] = useState(initialErrs);
    const [token, setToken] = useState(initialTokenVals);


    let client = new accountsClient();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
       
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.checked)
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        /**
         * @description Handles the form submission. Should send a AJAX request to the user login endpoint
         * @resource https://djoser.readthedocs.io/en/latest/token_endpoints.html#token-create
         */
        event.preventDefault();

        const getToken = client.tokenLogin(formValues.email, formValues.password)
        getToken.then((response) => {
            switch(response.status) {
                case 400:
                    setErrorMessage({
                        email: typeof(response.data!.email) === "undefined" ? [""]: response.data!.email,
                        password: typeof(response.data!.password) === "undefined" ? [""]: response.data!.password
                    });
                    break;
                case 200:
                    setToken(response.data.auth_token)
                    document.cookie = "cookiename=Hello"
                    break;
                default:
                    throw new Error(`Status code ${response.status} is invalid. 
                    Check https://djoser.readthedocs.io/en/latest/token_endpoints.html#token-create`)
            }
            console.log(document.cookie)
        });
        
    }

     return(
        <div className = {classes.root}>
            <Container component = "main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate={true} onSubmit = { submit }>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                id="email"
                                name="email"
                                label="email"
                                fullWidth = {true}           
                                required={true}
                                value = {formValues.email}
                                onChange={ handleChange }
                                errorMessage={ errorMessage.email }
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <PasswordField
                            id="password"
                            showTooltip= {false}
                            value={ formValues.password }
                            errorMessage={ errorMessage.password }
                            onChange={ handleChange }/>
                        </Grid>
                        <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox 
                                        value="remember" 
                                        color="primary"
                                        onChange = { handleCheckbox }
                                        />}
                            label="Remember me"
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
                        <Link href={configuration["url-register"]} variant="body2">
                            Not registered? create an account
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
     )
};

export default Login;