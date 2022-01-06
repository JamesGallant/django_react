import React, { FC, useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getRegisteredApp, selectAppData } from "../../../store/slices/appsSlice";
import MediaCard from "../../common/cards/MediaCard";
import ContentDialog from "../../common/dialogs/ContentDialog";
import CookieHandler from "../../../modules/cookies";

import { useNavigate } from "react-router-dom";

import type { RegisterAppPayloadInterface } from "../../../types/applicationTypes";

const renderApps = (): JSX.Element => {

	return(<div></div>);
};

const AppStoreView: FC = (): JSX.Element | null => {
	const navigate = useNavigate();
	/**
	 * This component will eventually be an appstore when we have apps. For now rendering the first application
	 */
	
	const dispatch = useAppDispatch();
	const registeredApps = useAppSelector(selectAppData);
	const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

	useEffect(() => {
		const getApps = async () => {
			const cookies: CookieHandler = new CookieHandler();
			const token: string = cookies.getCookie("authToken");
			const payload: RegisterAppPayloadInterface = {
				authToken: token,
				url: ""
			};
			await dispatch(getRegisteredApp(payload));
			if (registeredApps.detail) {
				//TODO some error handling
				alert(registeredApps.detail);
			}
		};
		getApps();
	},[dispatch]);

	return (
		<Box sx={{marginLeft: "5%"}}>
			<h1>Apps</h1>
			<MediaCard 
				cardSx={{ width: "20vw"}}
				mediaHeight="140"
				mediaComponent="img"
				mediaSrc="https://picsum.photos/200/300"
				clickable={true}
				onCardClick={() => console.log("hello")}
				cardContentElements={
					<Typography variant="h4" color="text.secondary" sx={{whiteSpace: "pre-wrap"}}>
						Statistica
					</Typography>
				}
				cardActionElements={
					<Stack 
						direction="row"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={1}
						justifyContent="center"
					>
						<Button 
							disabled
							variant="outlined"
							size="small">
							Learn more
						</Button>
						<Button 
							onClick={() => setPurchaseDialogOpen(true)}
							variant="outlined"
							size="small">
							Purchase
						</Button>
					</Stack>

				}
			/>
			<ContentDialog 
				maxWidth="md"
				isOpen={isPurchaseDialogOpen}
				dialogTitle="Purchase statistica"
				okBtnText="Confirm"
				onClose={ () => setPurchaseDialogOpen(false) }
				onOk={ () => navigate("testPlugin")}
				content={
					<Typography>
						Some text goes here
					</Typography>
				}
			/>
		</Box>
	);
};

export default AppStoreView;