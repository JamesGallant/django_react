import { render } from '@testing-library/react';

import ApplicationStatisticsView from '../applicationStatisticsView';

describe("Testing the dashboard view", () => {
    it("mounts", () => {
        render(<ApplicationStatisticsView />)
    })
});
