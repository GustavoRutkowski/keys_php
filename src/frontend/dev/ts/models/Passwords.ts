import Api from "../utils/Api";
import LocalData from "../utils/LocalData";

class Passwords {
    private static api: Api = new Api({ url: 'http://localhost:2469', headers: { 'token': LocalData.get('token') as string || '' } });

    public static async getUserPasswords() {
        const passwords = await this.api.get('passwords');
        return passwords;
    }

    public static async createPassword(value: string) {
        const passwordCreated = await this.api.post('passwords', { value, software_id: 1 });
        return passwordCreated;
    }
}

export default Passwords;
