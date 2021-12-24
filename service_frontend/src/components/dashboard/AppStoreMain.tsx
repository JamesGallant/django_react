import React, { FC, useState } from "react";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectVeiwDashboard } from "../../store/slices/viewSlice";

import MediaCard from "../common/cards/MediaCard";
import ContentDialog from "../common/dialogs/ContentDialog";
import { truncate } from "fs";
const AppStoreMain: FC = (): JSX.Element | null => {
	/**
	 * This component will eventually be an appstore when we have apps. For now rendering the first application
	 */
	const dashboardView = useAppSelector(selectVeiwDashboard);
	const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
	if(dashboardView.appstore) {
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
					onClose={() => setPurchaseDialogOpen(false) }
					onOk={() => console.log("Okay")}
					content={
						<Typography>
							Some text goes here
						</Typography>
					}
				/>
			</Box>
		);
	} else {
		return(null);
	}
};

export default AppStoreMain;