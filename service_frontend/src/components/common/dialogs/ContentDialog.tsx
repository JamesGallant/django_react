import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider, Breakpoint } from "@mui/material";

interface ContentDialogInterface {
	isOpen?: boolean
	title?: string
	cancelBtnText?: string
	okBtnText?: string
	maxWidth?: Breakpoint
	fullScreen?: boolean
	fullWidth?: boolean
	closeOnClickaway?: boolean
	onClose: any
	onOk?: () => void
	content: JSX.Element
	customActions?: JSX.Element
}

const ContentDialog = (props:ContentDialogInterface): JSX.Element => {
	const {isOpen=false, title="", cancelBtnText="Cancel", okBtnText="Ok", maxWidth="sm", 
		fullWidth=false, fullScreen=false, closeOnClickaway=true, onClose, onOk, content, 
		customActions } = props; 
	
	
	return(
		<Dialog
			fullScreen={fullScreen}
			open={ isOpen }
			fullWidth={fullWidth}
			disablePortal
			onClose={ closeOnClickaway ? onClose :  null}
			maxWidth={maxWidth}
		>
			<DialogTitle
				id="standard-alert-dialog"
			>
				<strong>{title}</strong>
				<IconButton
					aria-label="close"
					onClick={ onClose === undefined ? onOk : onClose }
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
				{content}
			</DialogContent>
			{customActions === undefined ? 
				<DialogActions>
					{onClose === undefined ? null : <Button onClick={  onClose } autoFocus>{cancelBtnText}</Button>}
					{onOk === undefined ? null : <Button onClick={  onOk } autoFocus>{okBtnText}</Button>}
				</DialogActions> 
				:
				<DialogActions>
					{customActions}
				</DialogActions>
			}
		</Dialog>
	);
};

export default ContentDialog;