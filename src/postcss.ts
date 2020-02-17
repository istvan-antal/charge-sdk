/* eslint-disable @typescript-eslint/no-var-requires */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import readCache from 'read-cache';

const postcssSimpleVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');

const load = (filename: string) => readCache(filename, 'utf-8');

const postCssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    // ident: 'postcss',
    sourceMap: true,
    plugins: () => [
        postcssImport({
            load: (filename: string, importOptions: {}) => load(filename).then((content: string) => {
                if (filename.endsWith('.json')) {
                    return (Object.entries(JSON.parse(content)).map(([name, value]) => (
                        `$${name}: ${value};`)).join('\n'));
                }
                return content;
            }),
        }),
        // require('postcss-flexbugs-fixes'),
        (postcssSimpleVars as any)(),
        postcssNested(),
    ],
};

export const createPostCssLoader = (development?: boolean) => {
    if (!development) {
        return {
            test: [/\.css$/, /\.scss$/],
            loaders: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: './',
                    },
                },
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        importLoaders: 1,
                        sourceMap: true,
                    },
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCssOptions,
                },
            ],
        };
    }

    return {
        test: [/\.css$/, /\.scss$/],
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: postCssOptions,
            },
        ],
    };
};