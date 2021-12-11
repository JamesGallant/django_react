import * as React from "react";
import Box from "@mui/material/Box";
import { TextField as MuiTextField } from "@mui/material/";
import Autocomplete from "@mui/material/Autocomplete";

import countries from "../../../utils/countryData";

export default function CountrySelect(props: any): JSX.Element {
	const { onChange, errorMessage=[""], width="100%" } = props;

	return (
		<Autocomplete
			id="select-country"
			sx={{width: width}}
			options={countries}
			onChange={ onChange }
			autoHighlight
			getOptionLabel={(option) => option.label}
			renderOption={(props, option) => (
				<Box 
					component="li" 
					sx={{ "& > img": { mr: 2, flexShrink: 0 } }} 
					{...props}>
					<img
						loading="lazy"
						width="20"
						src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
						srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
						alt=""
					/>
					{option.label} ({option.code}) +{option.phone}
				</Box>
			)}
			renderInput={(params) => (
				<MuiTextField
					{...params}
					onChange={onChange}
					helperText={ errorMessage.join(" ") }
					error={ errorMessage.length === 1 &&  errorMessage[0] === "" ? false: true }
					label="Country"
					inputProps={{
						...params.inputProps,
						autoComplete: "new-password", // disable autocomplete and autofill
					}}
				/>
			)}
		/>
	);
}