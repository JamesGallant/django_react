import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { toggleDashboardView } from "../../store/slices/viewSlice";

import { Box, AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import {AccountCircle, Settings, Logout } from "@mui/icons-material";
import AppsIcon from "@mui/icons-material/Apps";
import configuration from "../../utils/config";

const Navbar: FC = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useAppDispatch();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isProfileMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	return(
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static" enableColorOnDark={true} >
				<Toolbar>
					<IconButton
						size="large"
						edge="end"
						aria-label="nav display apps"
						aria-controls="nav-apps"
						aria-haspopup="true"
						onClick={() => dispatch(toggleDashboardView("appstore"))}
						color="inherit"
					>
						<AppsIcon fontSize="large" />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						size="large"
						edge="end"
						aria-label="userAccount"
						aria-controls="nav-profile"
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						<AccountCircle fontSize="large" />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={isProfileMenuOpen}
						onClick={handleProfileMenuClose}
					>
						<MenuItem onClick={() => dispatch(toggleDashboardView("profile"))}>
							<ListItemIcon>
								<AccountCircle fontSize="small" />
							</ListItemIcon>
						Profile
						</MenuItem>
						<MenuItem onClick={() => dispatch(toggleDashboardView("settings"))}>
							<ListItemIcon>
								<Settings fontSize="small" />
							</ListItemIcon>
						Settings
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => history.push(configuration["url-logout"])}>
							<ListItemIcon>
								<Logout fontSize="small" />
							</ListItemIcon>
						Log out
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
		</Box>	
	);
};

export default Navbar;
