import React, { FC, useEffect } from "react";

import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import configuration from "../utils/config";
import authenticate from "../modules/authenticate";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            padding: theme.spacing(5)
        }
    })
);

const HomeView: FC = () => {

    const classes = useStyles();
    useEffect(() => {
        authenticate();
    }, [])

    return(
        <div className={classes.root}>
            <Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                            <a href={ configuration["url-register"] }> Register </a>
                    </Grid>
                    <Grid item xs={12}>
                            <a href={ configuration["url-login"] }>Login </a>
                    </Grid>
                    <Grid item xs={12}>
                            <a href={  configuration["url-dashboard"] }>dashboard</a>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomeView;