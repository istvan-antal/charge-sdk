/* eslint max-lines: ["error", 250] */
import { resolve, dirname } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createPostCssLoader } from './postcss';

/* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
const readCurrentPackageJson = () => require(resolve(process.cwd(), './package.json'));

export const createBaseWebpackConfig = ({ development }: { development?: boolean } = {}) => {
    const packageJson = readCurrentPackageJson();
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
        entry: {},
        output: {
            path: resolve(process.cwd(), './dist'),
            filename: `[name]-${version}.js`,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-transform-react-jsx',
                            [
                                '@babel/plugin-proposal-class-properties',
                                {
                                    loose: false,
                                },
                            ],
                            '@babel/plugin-transform-modules-commonjs',
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-numeric-separator',
                        ],
                    },
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
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
            /* eslint-disable-next-line wrap-iife */
            (() => {
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

const wrapEntryPoint = (entryPoint: string, { hmr }: { hmr?: boolean }) => (hmr ?
    [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        entryPoint,
    ] :
    [
        entryPoint,
    ]
);

/* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require */
const importCompilerMiddleware = (compilerMiddleware: string) => require(
    resolve(process.cwd(), compilerMiddleware),
).default;

interface WebpackConfigCreateParameters {
    hmr?: boolean;
    development?: boolean;
    pages?: {
        [key: string]: string;
    };
}

/* eslint complexity: ['error', 10] */
export const createWebpackConfig = ({ hmr, development, pages }: WebpackConfigCreateParameters = {}) => {
    const packageJson = readCurrentPackageJson();
    const appEntryPoint = packageJson.main || './src/index';
    const sdkConfig = packageJson.chargeSdk || {};
    const entryPoints: {
        [key: string]: string;
    } = pages || sdkConfig.pages || { index: appEntryPoint };
    const appHtmlTemplate = `${dirname(appEntryPoint)}/index.html`;
    const appCompilerMiddleware = sdkConfig.compilerMiddleware &&
        importCompilerMiddleware(sdkConfig.compilerMiddleware);

    if (sdkConfig.html === undefined) {
        sdkConfig.html = true;
    }

    const config = createBaseWebpackConfig({ development });

    if (sdkConfig.html) {
        config.plugins = [
            ...config.plugins,
            ...Object.entries(entryPoints).map(page => new HtmlWebpackPlugin({
                inject: true,
                template: appHtmlTemplate,
                filename: `${page[0]}.html`,
                chunks: [page[0], 'commons'],
            })),
        ];
    }

    config.entry = {
        ...Object.entries(entryPoints).reduce((a, b) => ({
            ...a,
            [b[0]]: wrapEntryPoint(b[1], { hmr }),
        }), {}),
    };

    if (hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (appCompilerMiddleware) {
        return appCompilerMiddleware(config, { hmr, development });
    }

    return config;
};

export const createCompiler = (options: WebpackConfigCreateParameters = {}) => (
    webpack(createWebpackConfig(options))
);