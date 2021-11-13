import React, { FC } from "react";
import { useHistory } from "react-router-dom";

import { Box, AppBar, Toolbar, IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import {AccountCircle, Settings, Logout } from "@mui/icons-material";

import { logout } from "../../modules/authentication";
import configuration from "../../utils/config";

const Navbar: FC = (): JSX.Element => {
	const history = useHistory();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isProfileMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleProfileMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		history.push(configuration["url-logout"]);
	};

	return(
		<Box sx={{flexGrow: 1}}>
			<AppBar position="static" enableColorOnDark={true}>
				<Toolbar>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						size="large"
						edge="end"
						aria-label="userAccount"
						// aria-controls={menuId}
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
						<MenuItem>
							<ListItemIcon>
								<AccountCircle fontSize="small" />
							</ListItemIcon>
						Profile
						</MenuItem>
						<MenuItem>
							<ListItemIcon>
								<Settings fontSize="small" />
							</ListItemIcon>
						Account settings
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleLogout}>
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
