import express, { json } from 'express';
import cors from 'cors';
import router from './router.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

const app = express();

const corsOptions = {
    origin: `http://localhost:${process.env.SERVER_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
app.use(json());
app.use(router);

export default app;
