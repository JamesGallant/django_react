import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {getUser, selectUserData} from "../../store/slices/userSlice";
import CookieHandler from '../../modules/cookies';

const ApplicationStatisticsView: FC = (): JSX.Element => {
    const cookies = new CookieHandler()
    const user = useAppSelector(selectUserData);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const token = cookies.getCookie("authToken")
        dispatch(getUser(token))
    }, [])

    return(
        <h1> Hello stats: {user.email}</h1>
    );
};

export default ApplicationStatisticsView;