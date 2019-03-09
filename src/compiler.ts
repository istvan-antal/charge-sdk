import { resolve, dirname } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createPostCssLoader } from './postcss';

export const createBaseWebpackConfig = ({ development }: { development?: boolean } = {}) => {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
    const packageJson = require(resolve(process.cwd(), './package.json'));
    const version = process.env.VERSION || packageJson.version;

    const plugins = [
        new webpack.NamedModulesPlugin(),
    ];

    if (!development) {
        plugins.push(new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].chunk.css',
        }));
    }

    const config = ({
        mode: development ? 'development' : 'production',
        devtool: !development ? 'source-map' : 'cheap-module-source-map',
        // tslint:disable-next-line:no-any
        entry: {},
        output: {
            path: resolve(process.cwd(), './dist'),
            filename: `[name]-${version}.js`,
        },
        module: {
            rules: [
                {
                    test: /\.(c|cpp)$/,
                    use: {
                        loader: 'cpp-wasm-loader',
                        options: {
                            asmJs: true,
                        },
                    },
                },
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
                {
                    test: [
                        /\.bmp$/,
                        /\.gif$/,
                        /\.jpe?g$/,
                        /\.png$/,
                        /\.webp$/,
                        /\.ttf$/,
                        /\.eot$/,
                        /\.woff$/,
                        /\.woff2$/,
                        /\.svg$/,
                    ],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/[name].[hash:8].[ext]',
                    },
                },
                createPostCssLoader(development),
            ],
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.c', '.cpp'],
        },
        plugins,
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        name: 'commons',
                        chunks: 'initial',
                        minChunks: 2,
                        minSize: 0,
                    },
                },
            },
            occurrenceOrder: true,
        },
        externals: [
            /* eslint-disable-next-line wrap-iife, func-names */
            (function () {
                const IGNORES = [
                    'electron', 'child_process', 'fs',
                ];
                /* eslint '@typescript-eslint/no-explicit-any': 0 */
                return (_: any, request: any, callback: any) => {
                    if (IGNORES.indexOf(request) >= 0) {
                        // tslint:disable-next-line:no-null-keyword prefer-template
                        return callback(null, `require('${request}')`);
                    }
                    return callback();
                };
            })(),
        ],
    });

    return config;
};


const wrapEntryPoint = ({ entryPoint, hmr }: { entryPoint: string; hmr?: boolean }) => (hmr ?
    [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        '@babel/polyfill',
        entryPoint,
    ] :
    [
        '@babel/polyfill',
        entryPoint,
    ]
);

/* eslint complexity: ["error", 10] */
export const createWebpackConfig = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) => {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
    const packageJson = require(resolve(process.cwd(), './package.json'));

    const appEntryPoint = packageJson.main || './app/index';
    const appHtmlTemplate = `${dirname(appEntryPoint)}/index.html`;
    const sdkConfig = packageJson.chargeSdk || packageJson.reactTsRuntime || {};
    const appCompilerMiddleware = sdkConfig.compilerMiddleware &&
    /* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
        require(resolve(process.cwd(), sdkConfig.compilerMiddleware)).default;

    if (sdkConfig.html === undefined) {
        sdkConfig.html = true;
    }

    const config = createBaseWebpackConfig({ development });

    if (sdkConfig.html) {
        config.plugins.push(new HtmlWebpackPlugin({
            template: appHtmlTemplate,
        }));
    }

    config.entry = {
        index: wrapEntryPoint({ entryPoint: appEntryPoint, hmr }),
    };

    if (hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (appCompilerMiddleware) {
        return appCompilerMiddleware(config, { hmr, development });
    }

    return config;
};

export const createCompiler = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) => (
    // tslint:disable-next-line:max-file-line-count
    webpack(createWebpackConfig({ hmr, development }))
);