module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        "jest/globals": true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'jest',
    ],
    settings: {
        'import/resolver': {
            'node': {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx",
                ]
            }
        },
    },
    rules: {
        'max-len': ['error', 120],
        'max-lines': ['error', 200],
        indent: ['error', 4],
        'operator-linebreak': ["error", "after"],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'function-paren-newline': 0,
        'react/jsx-filename-extension': ['error', {
            "extensions": [".tsx", ".jsx"]
        }],
        'react/sort-comp': ['error', {
            order: [
                'static-methods',
                'everything-else',
                'lifecycle',
                'render',
                'destruct'
            ],
            groups: {
                lifecycle: [
                    'displayName',
                    'propTypes',
                    'contextTypes',
                    'childContextTypes',
                    'mixins',
                    'statics',
                    'defaultProps',
                    'getDefaultProps',
                    'getInitialState',
                    'getChildContext',
                    'getDerivedStateFromProps',
                    'componentWillMount',
                    'UNSAFE_componentWillMount',
                    'componentDidMount',
                    'componentWillReceiveProps',
                    'UNSAFE_componentWillReceiveProps',
                    'shouldComponentUpdate',
                    'componentWillUpdate',
                    'UNSAFE_componentWillUpdate',
                    'getSnapshotBeforeUpdate',
                    'componentDidUpdate',
                ],
                destruct: [
                    'componentDidCatch',
                    'componentWillUnmount',
                ]
            },
        }],
        'eol-last': ['error', 'never'],
        'lines-between-class-members': ['error', 'never'],
        'arrow-parens': ['error', 'as-needed'],
        'array-type': ['error', { default: 'array-simple' }],
        "no-restricted-syntax": [
            "error",
            {
                "selector": "ForInStatement",
                "message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
            },
            {
                "selector": "LabeledStatement",
                "message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
            },
            {
                "selector": "WithStatement",
                "message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
            }
        ],
        'object-curly-newline': 0,
        'no-continue': 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/no-use-before-define': 0,
        'import/prefer-default-export': 0,
    },
};