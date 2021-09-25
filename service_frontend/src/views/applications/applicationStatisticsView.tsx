import { FC  } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectUserData} from "../../store/slices/userSlice";

const ApplicationStatisticsView: FC = (): JSX.Element => {
    const user = useAppSelector(selectUserData);
    return(
        <h1> Hello Lieve {user.first_name}</h1>
    );
};

export default ApplicationStatisticsView;