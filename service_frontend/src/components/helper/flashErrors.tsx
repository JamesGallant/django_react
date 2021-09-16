import React, { useState, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';

interface propTypes  {
    message: string,
    display: boolean
};

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: 20, 
        padding: 5,
        backgroundColor: "#00000000",
        borderColor: "#e30f00"
     },
     text: {
        paddingLeft: theme.spacing(4),
        paddingTop: theme.spacing(0.5),
        color: "#e30f00"
    }
}))


const FlashError = (props: propTypes): JSX.Element | null => {
    const { message, display } = props;

    const classes = useStyles();

    const [toggleDisplay, setToggleDisplay] = useState(display);

    useEffect(() => {
        setToggleDisplay(display);
     }, [display])

    const handleFlashError = () => {
        setToggleDisplay(false)
    };
    
    const toggleError = (): JSX.Element | null => {
        
        if (toggleDisplay) {
            return(<div>
                <Paper className={classes.root} variant="outlined" color="primary">
                    <Grid container  justifyContent="space-between">
                        <Grid item>
                        <Typography className={classes.text}>
                            { message }
                        </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton 
                                size="small"
                                onClick={ handleFlashError }
                                >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            </div>);
        } else {
            return(null)
        };
    };

    if (display) {
        return(toggleError());
    } else 
        return(null);
};

export default FlashError;