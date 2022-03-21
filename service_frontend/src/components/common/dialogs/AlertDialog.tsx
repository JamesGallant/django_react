import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Divider, Breakpoint } from "@mui/material";

interface AlertDialogInterface {
	isOpen?: boolean
	onClose: () => void
	onOk: () => void
	title?: string
	content?: string
	okBtnText?: string
	maxWidth?: Breakpoint
}

const AlertDialog = (props: AlertDialogInterface): JSX.Element => {
	const { isOpen=false, onClose, onOk, title="", content="", okBtnText="Agree", maxWidth="sm" } = props; 
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
				<strong>{title}</strong>
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
					{content}
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