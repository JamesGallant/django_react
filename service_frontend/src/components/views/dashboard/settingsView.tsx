import React, { useState } from "react";

import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material";

import SettingsProfile from "../../dashboard/settings/settingsProfile";
import SetingsAppearance from "../../dashboard/settings/settingsAppearance";
import SettingsAccount from "../../dashboard/settings/settingsAccount";
import SettingsBilling from "../../dashboard/settings/settingsBilling";
import SettingsApps from "../../dashboard/settings/settingsApps";
import type { TabPanelPropsInterface } from "../../../types/components";

const TabRoot = styled(Box)({
	flexGrow: 1, 
	bgcolor: "background.paper", 
	display: "flex", 
	marginLeft: "5%"
});

const SettingsView = (): JSX.Element | null => {
	const [tabValue, setTabValue] = useState(0);

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
			//@TODO makestyles div below
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`settings-tabpanel-${index}`}
				aria-labelledby={`settings-tabpanel-${index}`}
				{...other}
			>
				{value === index && (
					<div style={{ marginLeft: "5vw", paddingTop: "1vh"}}>
						{children}
					</div>
				)}
			</div>
		);
	};

	return (
		<TabRoot>
			<Tabs
				orientation="vertical"
				aria-label="settings-tabpanel"
				sx={{ borderRight: 2, borderColor: "divider", alignItems: "flex-end", height: "80vh" }}
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
		</TabRoot>
	);
};
export default SettingsView;