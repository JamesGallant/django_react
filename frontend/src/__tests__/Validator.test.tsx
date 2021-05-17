import FormValidator from '../utils/validators'

test("no Validation", () => {
    let blankValidator = new FormValidator("")

    expect(blankValidator.validate("")).toBe("")
});

test("No empty fields", () => {
    let testValdator = new FormValidator("noEmptyFields")

    expect(testValdator.validate("Some text")).toBe("");
    expect(testValdator.validate("")).toBe("This field is required");
});

test("valid email field", () => {
    let testValidator = new FormValidator("validateEmail")

    expect(testValidator.validate("user@email.com")).toBe("")
    expect(testValidator.validate("notAnEmail")).toBe("Enter a valid email")
});

test("valid password field", () => {
    let testValidator = new FormValidator("validatePassword")

    expect(testValidator.validate("201")).toBe("")
    expect(testValidator.validate("404")).toBe("Password is invalid")
});
