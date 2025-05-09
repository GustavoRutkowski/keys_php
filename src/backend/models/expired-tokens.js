import JWTToken from "../helpers/jwt-token.js";
import connection from "./connection.js";

class ExpiredTokens {
    static async addToken(token) {
        const query = 'INSERT INTO expired_tokens (token) VALUES (?)';

        const [addedToken] = await connection.execute(query, [token]);
        return { insertId: addedToken.insertId };
    };

    static async getAll() {
        const query = 'SELECT * FROM expired_tokens';

        const [tokens] = await connection.execute(query);
        return tokens;
    };

    static async includesToken(token) {
        const query = 'SELECT * FROM expired_tokens WHERE token = ?';

        const [results] = await connection.execute(query, [token]);
        
        const tokenFound = results.some(e => e.token === token);
        return tokenFound;
    };

    static async deleteToken(token) {
        const query = 'DELETE FROM expired_tokens WHERE token = ?';

        const [deletedToken] = await connection.execute(query, [token]);
        return deletedToken;
    };

    static async clearAllExpiredTokens() {
        const tokens = await this.getAll();

        tokens.forEach(async e => {
            const token = e.token;
            const result = JWTToken.verify(token);

            if (!result.valid) {
                await this.deleteToken(token);
            };
        });
    };
};

export default ExpiredTokens;
