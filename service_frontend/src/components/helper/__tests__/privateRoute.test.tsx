import { render} from '@testing-library/react';
import { BrowserRouter, Switch } from "react-router-dom";


import configuration from '../../../utils/config';
import DashboardView from '../../../views/dashboardView';
import PrivateRoute from "../privateRoute";

describe("Testing private routes", () => {
    it("renders correctly", () => {
        render(<BrowserRouter>
                    <Switch>
                        <PrivateRoute path={ configuration["url-dashboard"] } component={DashboardView} />
                    </Switch>
                </BrowserRouter>)
    });
})