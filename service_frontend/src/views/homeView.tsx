import React, { FC } from "react"

import configuration from "../utils/config";

import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            padding: theme.spacing(5)
        }
    }));
    
const HomeView: FC = () => {
    const classes = useStyles();
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
                            <a href={  "/auth/activate/Hello/World/" }>test page </a>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomeView;