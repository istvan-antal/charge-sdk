module.exports.default = (config) => ({
    ...config,
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
});