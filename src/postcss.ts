import autoprefixer from 'autoprefixer';
import postcssSimpleVars from 'postcss-simple-vars';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import readCache from 'read-cache';

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