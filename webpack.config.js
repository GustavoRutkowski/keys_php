import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsRoot = './src/frontend/dev/ts';
const outputRoot = './src/frontend/public';

const tsConfig = {
    entry: {
        dashboard: `${tsRoot}/dashboard.ts`,
        login: `${tsRoot}/login.ts`,
        register: `${tsRoot}/register.ts`,
    },

    output: {
        path: path.resolve(__dirname, `${outputRoot}/js`),
        filename: '[name].min.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: { comments: false }
                },
                extractComments: false
            })
        ]
    },

    devtool: 'source-map',

    plugins: [new CleanWebpackPlugin()]
};

export default tsConfig;
