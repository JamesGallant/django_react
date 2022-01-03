//Site specific
import HomeView from "./homeView";

// Accounts
import AccountActivationView from "./accounts/accountActivationView";
import AccountCreatedView from "./accounts/accountCreatedView";
import LoginView from "./accounts/loginView";
import RegisterView from "./accounts/registerView";
import ResetPassword from "./accounts/resetPasswordView";
import ResetPasswordConfirm from "./accounts/resetPasswordConfirmView";
import ResetUsernameConfirm from "./accounts/resetUsernameConfirmView";
import ResetEmailSent from "./accounts/resetEmailSentView";

// dashboard
import DashboardView from "./dashboard/dashboardView";
import AppStoreView from "./dashboard/appStoreView";
import ProfileView from "./dashboard/profileView";
import SettingsView from "./dashboard/settingsView";

const views = {
	HomeView,
	DashboardView,
	AccountActivationView,
	AccountCreatedView,
	LoginView,
	RegisterView,
	ResetPassword,
	ResetPasswordConfirm,
	ResetUsernameConfirm,
	ResetEmailSent
};

export default views;