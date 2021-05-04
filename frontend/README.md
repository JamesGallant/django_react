# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---------------------------------------------------------------------------------------
# Introduction

This is the frontend service built with react and templated with Typescript. The common things like Babel and web pack are
already available when using the `create-react-app` command which allows us to focus on development. The frontend service
will contain all the frontend code for now. Perhaps a future model can split these into individual frontend services. The
frontend will reference the backend through API calls to the other services.

The coding practise of the frontend is component based. the code is loacated in `src` and the entrypoint to the react application
is `src/App.tsx`. The src directory further contains `pages`, `components` and `css` directories. In `src/pages/page.tsx` individual 
web pages are found and these are imported into `src/App.tsx`. The pages in turn use components found in `src/components/component.tsx`
to generate the web pages. Pages represent the major units of the application while components represent re-usable pieces of logic
available to every page. 

# Test driven development

Components and logic is created using a test driven approach as much as possible. This insures that the components and buisiness
logic is wll represented. `Create react app` comes with test runners that work on ES6 out of the box. Tests are located in the
`__tests__` directory and imports components or utilities and the test file convention is `component.test.tsx`. Components and
logic functions that are not from trusted third parties should be tested, every component should at least have a smoke test. 

Learn more about [testing](https://facebook.github.io/create-react-app/docs/running-tests)

To run tests
```nodemon
npm test
```

Smoke test base code
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

```
Coverage reports can be accessed using jest as well

```nodemon
npm test -- --coverage
```
Some usefull info regarding the coverage report
 - Function (funcs) coverage Has each function (or subroutine) in the program been called?
 - Statement (stmts) coverage Has each statement in the program been executed?
 - Branch coverage Has each branch (also called DD-path) of each control structure (such as in if and case statements) been executed? For example, given an if statement, have both the true and false branches been executed? Another way of saying this is, has every edge in the program been executed?
 - Line coverage has each executable line in the source file been executed?


# To do
 - user login
 - user logout
 - create accounts
 - delete accounts
 - reset email
 - reset password
 - resend verification email
 - storing and retrieving tokens as cookies - cookie policy
 
 