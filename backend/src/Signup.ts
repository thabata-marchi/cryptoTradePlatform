import AccountDAO from "./AccountDAO";
import { validateCpf } from "./validateCpf";
import { validatePassword } from "./validatePassword";

export default class Signup {

    constructor (readonly accountDAO: AccountDAO) {
    }

    isValidName (name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }
    
    isValidEmail (email: string) {
        return email.match(/^(.+)\@(.+)$/);
    }

    async execute (input: any): Promise<any> {
        if (!this.isValidName(input.name)) throw new Error("Invalid name");
        if (!this.isValidEmail(input.email)) throw new Error("Invalid email");
        if (!validateCpf(input.document)) throw new Error("Invalid document");
        if (!validatePassword(input.password)) throw new Error("Invalid password");
        const accountId = crypto.randomUUID();
        const account = {
            accountId,
            name: input.name,
            email: input.email,
            document: input.document,
            password: input.password
        }
        await this.accountDAO.saveAccount(account);
        return {
            accountId
        }
    }
}
