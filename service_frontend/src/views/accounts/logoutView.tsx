import { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import configuration from '../../utils/config';
import { logout } from '../../modules/authentication';
const LogoutView: FC = () => {
    const history = useHistory();
    
    useEffect(() => {
        let authStorageStatus: string | null;
        logout().then(() => {
            authStorageStatus = window.localStorage.getItem("authenticated")
            if (authStorageStatus === "false") {
                history.push(configuration["url-home"])
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
       null
    );
};

export default LogoutView;