import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {getUser} from "../../modules/redux/userSlice";
import CookieHandler from '../../modules/cookies';

const ApplicationStatisticsView: FC = (): JSX.Element => {
    const cookies = new CookieHandler()
    const user = useAppSelector((state) => state.userData.user)
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const token = cookies.getCookie("authToken")
        dispatch(getUser(token))
    }, [])

    return(
        <h1> Hello stats: {user.data.email}</h1>
    );
};

export default ApplicationStatisticsView;