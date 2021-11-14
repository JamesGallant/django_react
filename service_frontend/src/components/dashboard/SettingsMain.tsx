import React, {FC, useState} from "react";
import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

import { Box, Tabs, Tab} from "@mui/material";

import type { TabPanelPropsInterface } from "../../types/Components";

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
					<Box sx={{ p: 3 }}>
						{children}
					</Box>
				)}
			</div>
		);
	};

	if(dashboardView.settings) {
		return (
			<Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: "80vh", paddingLeft: "5%"}}>
				<Tabs
					orientation="vertical"
					aria-label="settings-tabpanel"
					sx={{ borderRight: 1, borderColor: "divider", alignItems: "flex-start" }}
					textColor="primary"
					indicatorColor="primary"
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
					<h1>Edit profile</h1>					
				</TabPanel>
				<TabPanel value={tabValue} index={1}>
					<h1>Edit appearance</h1>					
				</TabPanel>
				<TabPanel value={tabValue} index={2}>
					<h1>Edit Account</h1>					
				</TabPanel>
				<TabPanel value={tabValue} index={3}>
					<h1>Edit Billing</h1>					
				</TabPanel>
				<TabPanel value={tabValue} index={4}>
					<h1>Edit Apps</h1>					
				</TabPanel>
			</Box>
		);
	} else {
		return(null);
	}
};
export default SettingsMain;