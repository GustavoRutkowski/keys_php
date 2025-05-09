import Users from "../models/users.js";

class UsersRoutes {
    // Create

    static async createUser(req, res) {
        const createdUser = await Users.createUser(req.body);
        return res.status(201).json(createdUser);
    };
    
    static async createPassword(req, res) {
        const createdPassword = await Users.createPassword(req.params.id, req.body);

        if (createdPassword.message) return res.status(404).json(createdPassword);

        return res.status(201).json(createdPassword);
    };

    // Get

    static async getAll(req, res) {
        const users = await Users.getAll();
        return res.status(200).json(users);
    };
    
    static async getUser(req, res) {
        const user = await Users.getUser(req.params.id);

        if (user.message) return res.status(404).json(user); 

        return res.status(200).json(user);
    };
    
    static async getAllPasswordsFrom(req, res) {
        const userPasswords = await Users.getAllPasswordsFrom(req.params.id);

        if (userPasswords.message) return res.status(404).json(userPasswords);

        return res.status(200).json(userPasswords);
    };
    
    static async getPasswordFrom(req, res) {
        const userPassword = await Users.getPasswordFrom(req.params.userId, req.params.passId);
        return res.status(200).json(userPassword);
    };

    // Update

    static async updateUser(req, res) {
        await Users.updateUser(req.params.id, req.body);
        return res.status(204).json();
    };
    
    static async updatePasswordFrom(req, res) {
        const { params } = req;
    
        await Users.updatePasswordFrom(params.userId, params.passId, req.body);
        return res.status(204).json();
    };

    // Delete

    static async deleteUser(req, res) {
        const deletedUser = await Users.deleteUser(req.params.id);
        return res.status(204).json(deletedUser);
    };
    
    static async deletePasswordFrom(req, res) {
        const { params } = req;
    
        await Users.deletePasswordFrom(params.userId, params.passId);
        return res.status(204).json();
    };

    // Login & Logout

    static async login(req, res) {
        const loginResult = await Users.login(req.body);

        return loginResult.sucess
            ? res.status(200).json(loginResult)
            : res.status(401).json(loginResult);
    };

    static async logout(req, res) {
        const token = req.headers['authorization'];

        const logoutResult = await Users.logout(token);
        return res.status(200).json(logoutResult);
    };
};

export default UsersRoutes;
