import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
    prepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils';

import { createWebpackConfig } from './compiler';

const port = process.env.PORT || '3000';
const host = '0.0.0.0';
const protocol = 'http';
const urls = prepareUrls(protocol, host, +port);

/* eslint-disable import/prefer-default-export, no-console */
export const run = () => {
    const config = createWebpackConfig({
        hmr: true, development: true,
    });
    const devServer = new WebpackDevServer(webpack(config), config.devServer || { hot: true });
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    devServer.listen(+port, host, (err: any) => {
        if (err) {
            console.log(err);
            return;
        }
        /* if (isInteractive) {
            clearConsole();
        } */
        console.log(chalk.cyan('Starting the development server...\n'));
        console.log(`Local URL: ${urls.localUrlForTerminal}`);
        console.log(`Local Network URL: ${urls.lanUrlForTerminal}`);
        // openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(sig => {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        process.on(sig as any, () => {
            devServer.close();
            process.exit();
        });
    });
};