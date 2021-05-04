import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';


type AppProps = {
    // related to the isLoaded type in default function
    isComponentLoaded: boolean;
    status: number;
};

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            position: 'absolute',
            flexGrow: 1, 
            left: '50%', 
            top: '50%',
            transform: 'translate(-50%, -50%)'

        },
        card: {
            padding: theme.spacing(5),
            textAlign: 'center',
            color: theme.palette.text.secondary
        },
    }),
);

const AccountActivation = ({ isComponentLoaded, status }: AppProps): JSX.Element =>  {
    const classes = useStyles();
  
    let message : string = ""
    if (isComponentLoaded) {

        switch (status) {
            case 204: {
                // no content, account created successfully
                message = `You're account is now active, you can now login to your account or return to the home page. Thank you for choosing ${ process.env.REACT_APP_SITE_NAME }`
                break;
            }
            case 403: {
                // forbidden, account is active
                message = `You're account has previously been activated, \n
                 you can now login to your account or return to the home page. Thank you for choosing ${ process.env.REACT_APP_SITE_NAME }`
                break;
            }
            
            case 400: {
                // bad request
                message = "We don't have a record for your account, first create an account or resend the account activation email"
            }
        };
        return (
            <div className={classes.root}>  
                <Grid>
                    <Paper className={classes.card} elevation={5}>
                        <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <h1>Welcome to {process.env.REACT_APP_SITE_NAME} account activation </h1>
                        </Grid>
                        <Grid item xs={12}>
                            <h2> { message } </h2>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" color="primary" href="/"> Home </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" color="primary" href="/login"> Login </Button>
                        </Grid>
                    </Grid>
                    </Paper>
                </Grid>
            </div>
        )
    }
    else {
        return (
            <div className={classes.root}>
                <CircularProgress />
            </div>
        )
    };
};

export default AccountActivation;