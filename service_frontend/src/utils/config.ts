/**
 * @description Configurations for sitewide changes
 */
const configuration = {
    // material ui configuration
    "mui-InputVariant": "outlined",

    // API endpoints
    "api-base": `${process.env.REACT_APP_BASE_API}`,
    "api-activateAccount": "auth/users/activation/",
    "api-createAccount": "auth/users/",
    "api-getUserData": "auth/users/me/",
    "api-resendActivationEmail": "auth/users/resend_activation/",
    "api-tokenLogin": "auth/token/login/",
    "api-tokenLogout": "auth/token/logout/",

    // internal urls registry
    "url-home": "/",
    "url-login": "/auth/login/",
    "url-logout": "/auth/logout/",
    "url-register": "/auth/register/",
    "url-dashboard": "/dashboard/",
    "url-statisticsApplication": "/statistics/",
    "url-accountCreated": "/auth/account-created/",
    "url-acitvateAccount": "/auth/activate/:uid/:token/", // this also neeeds changing in the backend accounts service

    // cookies
    "cookie-maxAuthDuration": 90

};

export default configuration;