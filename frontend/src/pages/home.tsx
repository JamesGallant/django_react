import React, { FC } from "react"

import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// testing 
import TextField from '../components/formFields/TextFieldComponent';
import { ThemeProvider } from '@material-ui/core/styles';
import MuiGlobalStyles from '../themes/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            padding: theme.spacing(5)
        }
    }));
    
const HomePage: FC = () => {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <ThemeProvider theme={MuiGlobalStyles}>
                <TextField />
            </ThemeProvider>
            <Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                            <a href="/register/"> Register </a>
                    </Grid>
                    <Grid item xs={12}>
                            <a href="/login/">Login </a>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomePage