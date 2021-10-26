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
import ResetPasswordEmailSent from "./accounts/resetPasswordEmailSentView";

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
	ResetPasswordEmailSent
};

export default views;