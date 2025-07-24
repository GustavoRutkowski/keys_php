import Api from "../utils/Api";

interface IUser {
    name: string;
    email: string;
    main_pass: string;
};

interface IUserCredentials {
    email: string;
    main_pass: string;
}

type TUserCreated = any;

class Users {
    private static api: Api = new Api({ url: 'http://localhost:2469' });

    // Create
    public static async createUser(credentials: IUser): Promise<TUserCreated> {
        const createData: TUserCreated = await this.api.post('users', credentials);
        return createData;
    }

    // Login
    public static async login(credentials: IUserCredentials) {
        const userLogged = await this.api.post('users/login', credentials);
        return userLogged;
    }
}

export default Users;
