import ExpiredTokens from './models/expired-tokens.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

const PORT = process.env.API_PORT || 1005;

app.listen(PORT, () => {
    console.warn(`API Server running in port ${PORT}...`)

    const twoHoursInterval = 2 * 60 * 60 * 1000;
    setInterval(ExpiredTokens, twoHoursInterval);
});
