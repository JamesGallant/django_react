import React, { FC, useState } from "react"

import TextField from './components/formFields/TextFieldComponent';
import { ThemeProvider } from '@material-ui/core/styles';
import MuiGlobalStyles from './utils/styles';


interface formTypes  {
    value: string;
}

const initialVals: formTypes = {
    value: ""
}

const TestingSomething: FC = () => {
    const [values, setValues] = useState(initialVals);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setValues({
            ...values,
            [name]: value,
        });

    }
    console.log(values)

    return(
        <div style={{padding: 100}}>
        <ThemeProvider theme={MuiGlobalStyles}>
            <TextField  name="value" 
                        id="testId" 
                        label="Test" 
                        value={values.value} 
                        validate="noEmptyFields"
                        didSubmit={true} 
                        onChange={handleChange}
                        required={true} />
        </ThemeProvider>
        </div>
    );
};

export default TestingSomething;