import { render } from '@testing-library/react';
import LogoutView from '../logoutView';

describe("Testing the dashboard view", () => {
    it("mounts", () => {
        render(<LogoutView />)
    });
})