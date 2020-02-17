import { createBaseWebpackConfig } from 'charge-sdk';
const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const compilerMiddleware = require('./compiler').default;

const contentConfig = createBaseWebpackConfig({ development: false });
contentConfig.entry = ['./src/static.tsx'];
(contentConfig as any).target = 'node';
(contentConfig as any).output = {
    ...contentConfig.output,
    filename: 'content.js',
    library: 'content',
    libraryTarget: 'commonjs',
};

const buildWithConfig = async (config: any) => new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err: any, stats: any) => {
        if (err) {
            reject(err);
            return;
        }
        const messages = formatWebpackMessages(stats.toJson({}, true));

        if (messages.errors.length) {
            reject(new Error(messages.errors.join('\n\n')));
            return;
        }
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(messages.warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
            // console.log(messages.warnings);
            // reject(new Error(messages.warnings.join('\n\n')));
            resolve();
        } else {
            console.log(chalk.green('Compiled successfully.\n'));
            resolve();
        }
    });
});

(async () => {
    await buildWithConfig(contentConfig);
    const content = require('../dist/content.js').content.render();

    const config = createBaseWebpackConfig({ development: false });

    config.entry = ['./src/index.tsx'];
    config.plugins.push(new HtmlWebpackPlugin({
        template: './src/index.html',
        content,
    }));
    await buildWithConfig(config);
    // await buildWithConfig(compilerMiddleware(config));

})().catch(e => {
    throw e;
});

// build();