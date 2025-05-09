import IUserCredentials from "../interfaces/i-user_credentials";
import THTTPPostResponse from "../types/t-http-post-response";
import Api from "../utils/api";

class Users {
    private static api: Api = new Api({ url: 'http://localhost:2469' });

    // Create
    public static async createUser(credentials: IUserCredentials): Promise<THTTPPostResponse> {
        const createData: THTTPPostResponse = await this.api.post('users', credentials);
        console.log(createData);
        
        return createData;
    }
}

export default Users;
