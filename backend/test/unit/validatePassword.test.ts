import { validatePassword } from "../../src/validatePassword";

test("Deve validar a senha", () => {
    const password = "asdQWE123";
    const isValid = validatePassword(password);
    expect(isValid).toBe(true);
});

test.each([
    "asd",
    "asdqwezxc",
    "ASDQWEZXC",
    "asdqwe123",
    "12345678"
])("Não deve validar a senha", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
});