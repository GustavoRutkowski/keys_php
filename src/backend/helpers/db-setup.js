class DBSetup {
    constructor(connection) {
        if (!connection)
            throw new Error('db connection is undefined. Please provide a valid connection.');

        this.connection = connection;
    }

    async createTable([ table_setup, table_name ]) {
        try {
            await this.connection.execute(table_setup);
        } catch (err) {
            throw new Error(`error on creating table ${table_name}: ${err.message}`);
        }
    }

    get usersSetup() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                main_pass VARCHAR(255) NOT NULL
            );
        `;

        return [query, 'users'];
    };

    get passwordsSetup() {
        const query = `
            CREATE TABLE IF NOT EXISTS passwords (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                value VARCHAR(255) NOT NULL,
                referring_to VARCHAR(255) NOT NULL,
                icon LONGTEXT,
                is_deleted BOOL DEFAULT FALSE,
                timestamp DATETIME NOT NULL,

                FOREIGN KEY (user_id)
                REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        return [query, 'passwords']; 
    };

    get expiredTokensSetup() {
        const query = `
            CREATE TABLE IF NOT EXISTS expired_tokens (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                token LONGTEXT NOT NULL
            );
        `;

        return [query, 'expired_tokens']
    };
};

export default DBSetup;
