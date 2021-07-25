import { render, screen } from '@testing-library/react';

import DashboardView from '../dashboardView';

describe("Testing the dashboard view", () => {
    it("mounts", () => {
        render(<DashboardView />)
    })
})