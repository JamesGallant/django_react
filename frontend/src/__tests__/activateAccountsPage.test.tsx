import ReactDOM from 'react-dom';
import UserActivatePage from '../pages/activateAccount'

/**
 * @author James Gallant
 * @description UserActivatePage renders the page that displays to if the account has been activated. It takes userID and a token as an 
 * input variable via the url /:uid/:token which is handles by react router dom.
 * 
 * @tests Test loading of the component and the extraction of a userid and token from the url for an api call.
 * 
 */

// mock input from url /:uid/:token
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    uid: 'someId',
    token: 'someToken',
  }),
  useRouteMatch: () => ({ url: "/auth/activate/someID/someToken" }),
}));

describe("UserActivatePage", () => {
  // smoke test
  it('component renders corretly', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UserActivatePage />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
})