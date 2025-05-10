import { createPool } from 'mysql2/promise.js';
import DBSetup from '../helpers/db-setup.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

const connection = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const setup = new DBSetup(connection);
setup.createTable(setup.usersSetup);
setup.createTable(setup.passwordsSetup);
setup.createTable(setup.expiredTokensSetup);

export default connection;
