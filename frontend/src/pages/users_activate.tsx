import React, { FC } from "react";
import { useParams } from 'react-router';
import axios from 'axios';
import { StringDecoder } from "node:string_decoder";

export default function UsersActivate() {
    console.log(typeof(useParams()));
    interface ParamTypes {
        uid: string,
        token: string,
    };

    const { uid, token } = useParams<ParamTypes>();

    axios({
        // sends post request to djoser activation url on the backend. Move url to env
        method: "post",
        url: "http://localhost:8001/api/v1/auth/users/activation/",
        data: {'uid': uid, 'token': token},
        headers: {'Content-type': 'application/json'}
    })
    .then(function(response) {
        // handle success
        console.log(response)
    })
    .catch(function(response) {
        // handle error
        console.log(response)
    })

    return(
        <div>
            <h1> Hello world</h1>
            <h2>userId: {uid}</h2>
            <h2>Token: {token}</h2>
        </div>
    )
};