//Site specific
import HomeView from "./homeView";
import DashboardView from "./dashboardView";

// Accounts
import AccountActivationView from "./accounts/accountActivationView";
import AccountCreatedView from "./accounts/accountCreatedView";
import LoginView from "./accounts/loginView";
import LogoutView from "./accounts/logoutView";
import RegisterView from "./accounts/registerView";
import ResetPassword from "./accounts/resetPasswordView";
import ResetPasswordConfirm from "./accounts/resetPasswordConfirmView";
import ResetUsernameConfirm from "./accounts/resetUsernameConfirmView";
import ResetEmailSent from "./accounts/resetEmailSentView";

const views = {
	HomeView,
	DashboardView,
	AccountActivationView,
	AccountCreatedView,
	LoginView,
	LogoutView,
	RegisterView,
	ResetPassword,
	ResetPasswordConfirm,
	ResetUsernameConfirm,
	ResetEmailSent
};

export default views;