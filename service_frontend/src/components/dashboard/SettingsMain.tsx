import React, {FC, useState} from "react";
import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

import { Box, Tabs, Tab, AppBar } from "@mui/material";

import SettingsProfile from "./SettingsProfile";
import SetingsAppearance from "./SettingsAppearance";
import SettingsAccount from "./SettingsAccount";
import SettingsBilling from "./SettingsBilling";
import SettingsApps from "./SettingsApps";
import type { TabPanelPropsInterface } from "../../types/components";

const SettingsMain = (): JSX.Element | null => {
	const [tabValue, setTabValue] = useState(0);
	const dashboardView = useAppSelector(selectVeiwDashboard);

	const handleTabSwitch = (event: React.SyntheticEvent, tabValue: number): void => {
		setTabValue(tabValue);
	};

	const tabProps = (index: number) => {
		return {
			id: `settings-tab-${index}`,
			"aria-controls": `settings-tab-${index}`,
		};
	};

	const TabPanel = (props: TabPanelPropsInterface): JSX.Element => {
		const { children, value, index, ...other } = props;

		return(
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`settings-tabpanel-${index}`}
				aria-labelledby={`settings-tabpanel-${index}`}
				{...other}
			>
				{value === index && (
					<Box sx={{ marginLeft: 30, paddingTop: 3 }}>
						{children}
					</Box>
				)}
			</div>
		);
	};

	if(dashboardView.settings) {
		//TODO make styles here
		return (
			<Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "80vh", marginLeft: "5%"}}>
				<Tabs
					orientation="vertical"
					aria-label="settings-tabpanel"
					sx={{ borderRight: 2, borderColor: "divider", alignItems: "flex-end" }}
					textColor="inherit"
					indicatorColor="secondary"
					variant="fullWidth"
					value={tabValue}
					onChange={handleTabSwitch}
				>
					<Tab label="Profile" {...tabProps(0)}/>
					<Tab label="Appearance" {...tabProps(1)}/>
					<Tab label="Account" {...tabProps(2)}/>
					<Tab label="Billing" disabled {...tabProps(3)}/>
					<Tab label="Connencted apps" disabled {...tabProps(4)}/>
				</Tabs>
				<TabPanel value={tabValue} index={0}>
					<SettingsProfile />				
				</TabPanel>
				<TabPanel value={tabValue} index={1}>
					<SetingsAppearance />					
				</TabPanel>
				<TabPanel value={tabValue} index={2}>
					<SettingsAccount />					
				</TabPanel>
				<TabPanel value={tabValue} index={3}>
					<SettingsBilling />				
				</TabPanel>
				<TabPanel value={tabValue} index={4}>
					<SettingsApps />				
				</TabPanel>
			</Box>
		);
	} else {
		return(null);
	}
};
export default SettingsMain;