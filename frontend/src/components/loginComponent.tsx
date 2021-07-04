import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import TextField from './formFields/TextFieldComponent';
import PasswordField from './formFields/passwordComponent';

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

const initialFormVals: formTypes = {
    email: "",
    password: "",
}
const Login = () => {
    /**
     * @description Component that handles the login logic. Sends a request to the accounts backend for a token.
     * API endpoint requires email and password and returns [status] and token or [errors]
     */

    const classes = useStyles();
    const [formValues, setFormValues] = useState(initialFormVals);

    let client = new accountsClient();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
       
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        /**
         * @description Handles the form submission. Should send a AJAX request to the user login endpoint
         * @resource https://djoser.readthedocs.io/en/latest/token_endpoints.html#token-create
         */
        event.preventDefault();

        const getToken = client.tokenLogin(formValues.email, formValues.password)
        getToken.then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
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
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                id="email"
                                name="email"
                                label="email"
                                fullwidth={true}
                                required={true}
                                value = {formValues.email}
                                onChange={ handleChange }
                                error={ [""] } // handle this
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PasswordField
                                value={formValues.password}
                                error={ [""] }
                                onChange={ handleChange }
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
            </Container>
        </div>
     )
};

export default Login;