import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname));

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

const PORT = process.env.SERVER_PORT || 5500;

app.listen(PORT, () => console.warn(`Server running in port ${PORT}...`));
