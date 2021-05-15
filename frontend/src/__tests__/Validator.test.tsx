import FormValidator from '../utils/validators'

test("no Validation", () => {
    let blankValidator = new FormValidator("")

    expect(blankValidator.validate("")).toBe("")
})

test("No empty fields", () => {
    let testValdator = new FormValidator("noEmptyFields")

    expect(testValdator.validate("Some text")).toBe("");
    expect(testValdator.validate("")).toBe("This field is required");
})
