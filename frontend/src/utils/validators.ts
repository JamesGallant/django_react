
class FormValidator {
    /**
     * @Description Validator for our forms, a statement is passed to a function in this class to trigger a validation. The class 
     * will return a string with a error message.
     * 
     * @param validate: The type of validation to call, i.e. password, field, mobile ect 
     * 
     * @method blank: returns empty string, good for default values
     * @method noEmptyFields: Generic method to assert that a filed is filled
     * @method default: Throws a error 
     */

    validationType: string;

    public constructor(validate: string) {
        this.validationType = validate
    }

    private noEmptyFields(value: string): string {
        let basicError = value ? "": "This field is required"
        return basicError
    }

    private blank(): string {
        return("")
    }

    public validate(value: string): string {

        switch (this.validationType) {
            case "":
                return(this.blank());
            case "noEmptyFields":
                return(this.noEmptyFields(value))
            default:
                throw new TypeError("Validation method not found, see formValidator documentation")
        }
    };
};

export default FormValidator;