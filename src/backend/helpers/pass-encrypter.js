import { genSaltSync, hashSync, compareSync } from "bcrypt";

class PassEncrypter {
    static hashPassword(password, salts) {
        if (typeof password !== 'string')
            throw new TypeError('password is not a string');

        if (typeof salts !== 'number')
            throw new TypeError('salts is not a number');

        if (salts < 10) {
            const msg = 'the number of salts is below 10, which could compromise password security.'
            console.warn('⚠ WARN: ', msg);
        }

        const salt = genSaltSync(salts);
        const hash = hashSync(password, salt);

        return hash;
    }

    static comparePassHash(password, hash) {
        const isValid = compareSync(password, hash);
        return isValid;
    }
}

export default PassEncrypter;
