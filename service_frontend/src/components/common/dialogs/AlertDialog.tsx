import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider } from "@mui/material";


const AlertDialog = (props: any): JSX.Element => {
	const {isOpen=false, onClose, onOk, dialogTitle="", dialogText="", okBtnText="Agree", maxWidth="sm" } = props; 
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
				<DialogContentText>
					{dialogText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={ onClose } autoFocus>Cancel</Button>
				<Button onClick={ onOk } autoFocus>{okBtnText}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AlertDialog;