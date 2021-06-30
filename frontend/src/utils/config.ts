/**
 * @description Configurations for sitewide changes
 */
const configuration = {
    // material ui configuration
    "mui-InputVariant": "outlined",
    // API endpoints
    "api-base": `${process.env.REACT_APP_BASE_API_ACCOUNTS}`,
    "api-activateAccount": "users/activation/",
    "api-createAccount": "users/",
    "api-resendActivationEmail": "users/resend_activation/",
    // internal urls registry
    "url-home": "/",
    "url-login": "/login/",
    "url-register": "/register",
    "url-accountCreated": "/account-created/",
    "url-acitvateAccount": "/auth/activate/:uid/:token/", // this also neeeds changing in the backend accounts service

};

export default configuration;