import connection from './connection.js';
import UTCDate from '../helpers/utc-date.js';
import JWTToken from '../helpers/jwt-token.js';
import ExpiredTokens from './expired-tokens.js';
import PassEncrypter from '../helpers/pass-encrypter.js';

class Users {
    // Create
    static async createUser({ email, main_pass }) {
        const countQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';

        const [rows] = await connection.execute(countQuery, [email]);
        const [row] = rows;

        if (row.count > 0) return { message: 'email already exists' };

        const query = 'INSERT INTO users (email, main_pass) VALUES (?, ?)';

        // Fix 10 Salts
        const hashPassword = PassEncrypter.hashPassword(main_pass, 10);

        const [createdUser] = await connection.execute(query, [email, hashPassword]);
        return { insertId: createdUser.insertId };
    }

    static async createPassword(userId, { value, referring_to, icon }) {
        const user = await this.getUser(userId);

        if (!user) return { message: 'user not found' };

        const query = `
            INSERT INTO passwords
            (user_id, value, referring_to, icon, is_deleted, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const utcDate = new UTCDate();
        const timestamp = utcDate.toDatetime();

        // Fix 10 Salts
        const hashPassword = PassEncrypter.hashPassword(value, 10);

        const values = [userId, hashPassword, referring_to, icon || null, false, timestamp];

        const [createdPassword] = await connection.execute(query, values);
        return { insertId: createdPassword.insertId };
    }

    // Map
    static #mapPasswordsDatetime(passwordsList) {
        passwordsList.forEach(password => {
            password.timestamp = UTCDate.fromDatetime(password.timestamp);
        });
    }

    // Get
    static async getAll() {
        const [users] = await connection.execute('SELECT * FROM users');
        const [passwords] = await connection.execute('SELECT * FROM passwords');

        this.#mapPasswordsDatetime(passwords);

        // Creates a new array of users with their corresponding passwords.
        const usersStructure = users.map(user => {
            user.passwords = passwords
            .filter(password => password.user_id === user.id);

            return user;
        });

        return usersStructure;
    }

    static async getUser(id) {
        const userQuery = 'SELECT * FROM users WHERE id = ?';
        const passwordQuery = 'SELECT * FROM passwords WHERE user_id = ?';

        const [userRes] = await connection.execute(userQuery, [id]);
        const [userPasswords] = await connection.execute(passwordQuery, [id]);

        
        this.#mapPasswordsDatetime(userPasswords);
        
        const [user] = userRes;

        if (!user) return { message: 'user not found' };
        user.passwords = userPasswords;

        return user;
    }

    static async getAllPasswordsFrom(id) {
        const user = await this.getUser(id);

        if (user.message === 'user not found') return user;

        return user.passwords;
    }

    static async getPasswordFrom(userId, passwordId) {
        const query = 'SELECT * FROM passwords WHERE user_id = ? AND id = ?';

        const [passwordRes] = await connection.execute(query, [userId, passwordId]);

        this.#mapPasswordsDatetime(passwordRes);

        const [password] = passwordRes;
        return password;
    }

    // Update
    static async updateUser(id, { email, main_pass }) {
        const query = `
            UPDATE users
            SET email = ?, main_pass = ?
            WHERE id = ?
        `;

        const values = [email, main_pass, id];

        const [updatedUser] = await connection.execute(query, values);
        return updatedUser;
    }

    static async updatePasswordFrom(userId, passwordId, { value, referring_to, icon, is_deleted }) {
        const query = `
            UPDATE passwords
            SET value = ?, referring_to = ?, icon = ?, is_deleted = ?
            WHERE user_id = ? AND id = ?
        `;

        const values = [
            value,
            referring_to,
            icon || null,
            is_deleted || false,
            userId,
            passwordId
        ];

        const [updatedPassword] = await connection.execute(query, values);
        return updatedPassword;
    }

    // Delete
    static async deleteUser(id) {
        const query = 'DELETE FROM users WHERE id = ?';

        const [deletedUser] = await connection.execute(query, [id]);

        console.log(deletedUser);
        return deletedUser;
    }

    static async deletePasswordFrom(userId, passwordId) {
        const query = 'DELETE FROM passwords WHERE user_id = ? AND id = ?';

        const [deletedPassword] = await connection.execute(query, [userId, passwordId]);
        return deletedPassword;
    }

    // Login and Logout
    static async login({ email, main_pass }) {
        const query = 'SELECT * FROM users WHERE email = ?';
        
        const [results] = await connection.execute(query, [email]);
        const userNotFound = results.length === 0;

        if (userNotFound) return { sucess: false, message: 'invalid email' };
        
        const [user] = results;

        const passwordIsValid = PassEncrypter.comparePassHash(main_pass, user.main_pass);

        if (!passwordIsValid) return { sucess: false, message: 'invalid password' };

        const token = new JWTToken({ id: user.id, email: user.email });
        return { sucess: true, token: token.value };
    }

    static async logout(token) {
        await ExpiredTokens.addToken(token);
        return { message: 'logout completed' };
    }
}

export default Users;
