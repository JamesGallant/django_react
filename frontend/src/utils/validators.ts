class FormValidator {
    /**
     * @Description Validator for our forms, a statement is passed to a function in this class to trigger a validation. The class 
     * will return a string with a error message.
     * 
     * @param validate: The type of validation to call, i.e. password, field, mobile ect 
     * 
     * @method blank: returns empty string, good for default values
     * @method noEmptyFields: Generic method to assert that a field is filled
     * @method validateEmail: Basic test to see if the email field is contains an @ symbol
     * @method default: Throws a error 
     */

    validationType: string;

    public constructor(validate: string) {
        this.validationType = validate
    };

    private blank(): string {
        return("")
    };

    private noEmptyFields(value: string): string {
        return value ? "": "This field is required"
    };

    private validateEmail(value: string): string {
        return (/^[^\s@]+@[^\s@]+$/).test(value) === true ? "": "Enter a valid email"
    };

    public validate(value: string): string {

        switch (this.validationType) {
            case "":
                return(this.blank());

            case "noEmptyFields":
                return(this.noEmptyFields(value))
            
            case "validateEmail":
                return(this.validateEmail(value))

            default:
                throw new TypeError("Validation method not found, see formValidator documentation")
        }
    };
};

export default FormValidator;