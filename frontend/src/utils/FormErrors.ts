class HandleErrors {
    /**
     * @Description Handles general form errors using public class methods. Error messages are from the validators.
     * 
     * @param didSubmit: boolean to indicate form submission
     * @param ErrorMessage: string containing the error message
     * 
     * @returns boolean or string signifying the errors. 
     */

    didSubmit: boolean
    errorMessage: string

    public constructor(didSubmit: boolean, errorMessage: string) {
        this.didSubmit = didSubmit;
        this.errorMessage = errorMessage
    };

    public handleErr = (): boolean => {
        if (this.didSubmit) {
            return(this.errorMessage === "" ? false: true)
        } else {
            return(false)
        };
    };
 
    public handleHelper = (): string => {
        if (this.didSubmit) {
            return(this.errorMessage)
        } else {
            return("")
        };
    };
} 
export default HandleErrors