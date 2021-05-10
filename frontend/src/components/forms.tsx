import React, { useState } from 'react';
import axios from 'axios';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);


export default function UserData() {
  const classes = useStyles();
  const [firstname, setFirstname] = useState('')
  const [lastname, setlasttname] = useState('')
  const [email, setEmail] = useState('')
  const [id, setID] = useState(0)
  

  const populateFields = () => {
    axios({
      method: "get",
      url: 'http://localhost:8001/api/v1/auth/users/',
      headers: {'Authorization': 'Token: 4add7f9cda66e8c310f9dc1ca4401852b880d093'}
    })
    .then(function (response) {
      var userdata = response.data;
      
      setFirstname(userdata[id].first_name)
      setlasttname(userdata[id].last_name)
      setEmail(userdata[id].email)
   
      if (id === userdata.length-1) {
        setID(0)
      } else {
        setID(id + 1)
      }
    })
    .catch(function (error) {
      alert(error)
    });
  }

  return (
    <div>
        <form className={classes.root} noValidate autoComplete="off">
            <TextField id="userFirstName" label="first name" variant="outlined" value={firstname} />
            <TextField id="userLastName" label="last name" variant="outlined" value={lastname} />
            <TextField id="userEmail" label="email" variant="outlined" value = {email} />
        </form>

        <Button variant="contained" onClick={populateFields}>Next</Button>

    </div> 
  );
}