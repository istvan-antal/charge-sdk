import { createWebpackConfig } from './src/compiler';
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const port = process.env.PORT || '3000';
const host = '0.0.0.0';
const protocol = 'http';
const urls = prepareUrls(protocol, host, port);

export const run = () => {
    const config = createWebpackConfig({
        hmr: true, development: true,
    });
    const devServer = new WebpackDevServer(webpack(config), config.devServer || { hot: true });
    // tslint:disable-next-line:no-any
    devServer.listen(port, host, (err: any) => {
        if (err) {
            console.log(err);
            return;
        }
        /* if (isInteractive) {
            clearConsole();
        }*/
        console.log(chalk.cyan('Starting the development server...\n'));
        console.log(`Local URL: ${urls.localUrlForTerminal}`);
        console.log(`Local Network URL: ${urls.lanUrlForTerminal}`);
        // openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(sig => {
        // tslint:disable-next-line:no-any
        process.on(sig as any, () => {
            devServer.close();
            process.exit();
        });
    });
};