// // Encode
// const token = new Token({
//     email: 'rutkowskigustavo@gmail.com',
//     main_pass: 'Senha'
// });

// // Decode
// const decodedToken = Token.verify(token.value);

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

class JWTToken {
    constructor(payload, algorithm='HS256', expires='1d') {
        this.payload = payload;
        const secretKey = process.env.JWT_SECRET;
        this.expires = expires;

        const signOptions = {
            algorithm: algorithm,
            expiresIn: this.expires
        };

        // Sign the Token
        const token = jwt.sign(this.payload, secretKey, signOptions);
        this.value = token;
    };

    static verify(token) {
        const secretKey = process.env.JWT_SECRET;

        try {
            const decodedToken = jwt.verify(token, secretKey);
            return { valid: true, decoded_token: decodedToken };
        } catch (error) {
            return { valid: false, message: 'invalid token' };
        };
    };
};

export default JWTToken;
