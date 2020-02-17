import chalk from 'chalk';
import { createCompiler } from './compiler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

/* eslint-disable import/prefer-default-export, no-console */
export const build = () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    createCompiler().run((err: any, stats: any) => {
        if (err) {
            throw err;
        }
        const messages = formatWebpackMessages(stats.toJson({}, true));

        if (messages.errors.length) {
            throw new Error(messages.errors.join('\n\n'));
        }
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(messages.warnings.join('\n\n'));
            console.log(
                `\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`,
            );
        } else {
            console.log(chalk.green('Compiled successfully.\n'));
        }
    });
};