class LocalData {
    public static get(key: string): string | object {
        if (typeof key === 'string') return localStorage.getItem(key) as string;
        return JSON.parse(localStorage.getItem(key) as string);
    }

    public static set(key: string, value: object): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export default LocalData;
