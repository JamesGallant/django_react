import { createTheme } from '@material-ui/core/styles/';

const MuiGlobalTheme = createTheme({
    /**
     * @description Provides default values to style all material ui components across the entire site, component must be a child 
     * of <ThemeProvider theme={MuiGlobalTheme}>. Apart from props, CSS and other styles can be overidden as well. 
     * 
     * @resource https://material-ui.com/customization/globals/
     */
    props: {
        // MUI  base component name goes here
        MuiInputLabel: {
            variant: 'outlined',
        },
    },
})

export default MuiGlobalTheme;