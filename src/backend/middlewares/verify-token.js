import JWTToken from "../helpers/jwt-token.js";
import ExpiredTokens from "../models/expired-tokens.js";

async function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        const error = { message: 'token not provided' };
        return res.status(401).json(error);
    };

    const tokenExpired = await ExpiredTokens.includesToken(token);
    
    if (tokenExpired) {
        const error = { message: 'expired token' };
        return res.status(401).json(error);
    };

    const verifyResults = JWTToken.verify(token);

    if (!verifyResults.valid) {
        const error = { message: verifyResults.message };
        return res.status(401).json(error);
    };

    next();
};

export default verifyToken;
