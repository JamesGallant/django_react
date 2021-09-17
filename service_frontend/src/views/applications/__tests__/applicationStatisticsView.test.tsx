import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

import ApplicationStatisticsView from '../applicationStatisticsView';

describe("Testing the dashboard view", () => {
    it("mounts", () => {    
        render(
            <Provider store={store}> 
                <ApplicationStatisticsView />
            </Provider>
        );
    })
});
