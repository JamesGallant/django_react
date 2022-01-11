import React, { FC, useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Divider, Grid, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getRegisteredApp, selectAppData, selectAppStateStatus } from "../../../store/slices/appsSlice";
import MediaCard from "../../common/cards/MediaCard";
import ContentDialog from "../../common/dialogs/ContentDialog";
import CookieHandler from "../../../modules/cookies";

import { useNavigate } from "react-router-dom";

import type { RegisterAppPayloadInterface, AppDataInterface, AppDataUnion } from "../../../types/applicationTypes";
import { maxHeight } from "@mui/system";


const AppStoreView = (): JSX.Element | null => {
	const navigate = useNavigate();
	/**
	 * This component will eventually be an appstore when we have apps. For now rendering the first application
	 * 
	 * card functions: 
	 * disabled if disabled or not purchased
	 * click purchase displayes purchase options
	 * click learn more displayes learn more text
	 * 
	 */
	
	const dispatch = useAppDispatch();
	const registeredApps: AppDataUnion = useAppSelector(selectAppData);
	const appStateStatus: string = useAppSelector(selectAppStateStatus);
	const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
	const [apps, setApps] = useState([]);

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

	const appList = registeredApps.results?.map((app, index) => {
		return(
			<Grid key={index} item xs={3}>
				{ appStateStatus === "pending" ? <CircularProgress /> : 
					<MediaCard
						key={index} 
						cardSx={{ width: "15rem", height: "20rem", position: "absolute" }}
						mediaHeight="140"
						mediaComponent="img"
						mediaSrc="https://picsum.photos/200/300"
						clickable={!app.disabled}
						onCardClick={() => console.log("hello")}
						cardContentElements={
							<Stack 
								direction="column"
								spacing={1}
								divider={<Divider orientation="vertical" flexItem />}
							>
								<Typography variant="h4" color="text.secondary" sx={{wordWrap: "break-word"}}>
									{app.name}
								</Typography>
								<Typography variant="subtitle2" color="text.secondary" sx={{wordWrap: "break-word", textOverflow: "ellipsis"}}>
									{ app.card_description}
								</Typography>
							</Stack>
						}
						cardActionElements={
							<Stack sx={{position: "absolute", bottom: "10px"}}  alignItems="center" direction="row" justifyContent="space-between" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
								<Button>Learn more</Button>
								<Button>Purchase</Button>
							</Stack>
						}
					/>
				}
			</Grid>
		);
	});

	return (
		<Box sx={{marginLeft: "5%"}}>
			<h1>Apps</h1>
			
			<Grid container>
				{ appList }
			</Grid>
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