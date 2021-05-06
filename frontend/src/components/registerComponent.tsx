import React, { FC } from "react"
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            padding: theme.spacing(5)
        }
    }));

const RegisterComponent: FC = () => {
    /**
     * @Description Component registers the user user using API calls to the backend. Users will be registered but not active. 
     */
         const classes = useStyles();
    return(
        <div className={classes.root}>
            <h1> Register page</h1>
        </div>
    );   
};
export default RegisterComponent;