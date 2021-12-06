import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider } from "@mui/material";

const ContentDialog = (props:any): JSX.Element => {
	const {isOpen=false, dialogTitle="", dialogText="", cancelBtnText="Cancel", okBtnText="Ok", maxWidth="sm",
		onClose, onOk, content } = props; 
	return(
		<Dialog
			open={ isOpen }
			disablePortal
			onClose={ onClose }
			maxWidth={maxWidth}
		>
			<DialogTitle
				id="standard-alert-dialog"
			>
				<strong>{dialogTitle}</strong>
				<IconButton
					aria-label="close"
					onClick={ onClose }
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<Divider />
			<DialogContent>
				{dialogText === "" ? null : 
					<DialogContentText>
						{dialogText}
					</DialogContentText>
				}
				<br/>
				{content}
			</DialogContent>
			<DialogActions>
				<Button onClick={  onClose } autoFocus>{cancelBtnText}</Button>
				<Button onClick={  onOk } autoFocus>{okBtnText}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ContentDialog;