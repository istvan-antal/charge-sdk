import { resolve, join, dirname } from 'path';
import { existsSync } from 'fs';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const readCache = require('read-cache');
const load = (filename: string) => readCache(filename, 'utf-8');

const postCssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    // ident: 'postcss',
    sourceMap: true,
    plugins: () => [
        postcssImport({
            load: (filename: string, importOptions: {}) =>
                load(filename).then((content: string) => {
                    if (filename.endsWith('.json')) {
                        return (Object.entries(JSON.parse(content)).map(([name, value]) =>
                            `$${name}: ${value};`).join('\n'));
                    }
                    return content;
                }),
        }),
        // require('postcss-flexbugs-fixes'),
        postcssSimpleVars(),
        postcssNested(),
        autoprefixer({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
        }),
    ],
};

const createPostCssLoader = (development?: boolean) => {
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
                        minimize: true,
                        sourceMap: true,
                    },
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: postCssOptions,
                },
            ],
            /* loader: ExtractTextPlugin.extract(
                Object.assign({
                    fallback: {
                        loader: require.resolve('style-loader'),
                        options: {
                            hmr: false,
                        },
                    },
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: postCssOptions,
                        },
                    ],
                },
                    extractTextPluginOptions,
                ),
            ),
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            */
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

export const createBaseWebpackConfig = ({ development }: { development?: boolean } = {}) => {
    const packageJson = require(resolve(process.cwd(), './package.json'));
    const version = process.env.VERSION || packageJson.version;

    const plugins = [
        new webpack.NamedModulesPlugin(),
    ];

    if (!development) {
        /* plugins.push(
            new ExtractTextPlugin({
                filename: `style-${version}.css`,
            }),
        );*/
        plugins.push(new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].chunk.css',
        }));
    }

    const projectHasTsConfig = existsSync(
        resolve(join(process.cwd(), 'tsconfig.json')),
    );

    const config = ({
        mode: development ? 'development' : 'production',
        devtool: !development ? 'source-map' : 'cheap-module-source-map',
        // tslint:disable-next-line:no-any
        entry: undefined as any,
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
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader',
                    options: projectHasTsConfig ? undefined : {
                        configFileName: require.resolve('charge-sdk/tsconfig.json'),
                    },
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
            occurrenceOrder: true, // To keep filename consistent between
            // different modes (for example building only)
        },
        externals: [
            // tslint:disable-next-line:only-arrow-functions
            (function () {
                const IGNORES = [
                    'electron', 'child_process', 'fs',
                ];
                // tslint:disable-next-line:no-any
                return (context: any, request: any, callback: any) => {
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

// tslint:disable-next-line:cyclomatic-complexity
export const createWebpackConfig = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) => {
    const packageJson = require(resolve(process.cwd(), './package.json'));

    const appEntryPoint = packageJson.main || './app/index';
    const appHtmlTemplate = `${dirname(appEntryPoint)}/index.html`;
    const reactTsRuntimeConfig = packageJson.reactTsRuntime || {};
    const appCompilerMiddleware = reactTsRuntimeConfig.compilerMiddleware &&
        require(resolve(process.cwd(), reactTsRuntimeConfig.compilerMiddleware)).default;

    if (reactTsRuntimeConfig.html === undefined) {
        reactTsRuntimeConfig.html = true;
    }

    const config = createBaseWebpackConfig({ development });

    if (reactTsRuntimeConfig.html) {
        config.plugins.push(new HtmlWebpackPlugin({
            template: appHtmlTemplate,
        }));
    }

    config.entry = hmr ?
        [
            require.resolve('react-dev-utils/webpackHotDevClient'),
            appEntryPoint,
        ] :
        [
            appEntryPoint,
        ];

    if (hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (appCompilerMiddleware) {
        return appCompilerMiddleware(config, { hmr, development });
    }

    return config;
};

export const createCompiler = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) =>
    // tslint:disable-next-line:max-file-line-count
    webpack(createWebpackConfig({ hmr, development }));