module.exports.default = (config) => ({
    ...config,
    module: {
        ...config.module,
        rules: [
            ...config.rules,
            {
                test: /\.(c|cpp)$/,
                use: {
                    loader: 'cpp-wasm-loader',
                    options: {
                        asmJs: true,
                    },
                },
            },
        ],
    },
});