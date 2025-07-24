type THTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface IApiConfig {
    url: string,
    headers?: HeadersInit
}

class Api {
    private url: string;
    private headers: Headers;

    constructor({ url, headers }: IApiConfig) {
        this.url = url;
        this.headers = new Headers(headers || {});
    }

    private async request(method: THTTPMethod, route: string, args: object): Promise<any> {
        const headersCopy = new Headers(this.headers);

        let endpoint = `${this.url}/${route}`

        const requestBody: RequestInit = {
            method,
            headers: headersCopy
        };

        if (['POST', 'PUT'].includes(method)) {
            headersCopy.set('Content-Type', 'application/json');
            requestBody.body = JSON.stringify(args);
        }

        if (['GET', 'DELETE'].includes(method)) {
            const query = new URLSearchParams(args as Record<string, string>).toString();
            endpoint += `?${query}`;
        }

        const res = await fetch(endpoint, requestBody);

        const data = await res.json();
        return data;
    }

    public async post(route: string, body: object = {}) {
        return await this.request('POST', route, body);
    }
    public async get(route: string, params: object = {}) {
        return await this.request('GET', route, params);
    }
    public async put(route: string, body: object = {}) {
        return await this.request('PUT', route, body);
    }
    public async delete(route: string, params: object = {}) {
        return await this.request('DELETE', route, params);
    }
}

export default Api;
