export const appTsxTemplate = `import * as React from 'react';

export default class App extends React.Component {
    render() {
        return (
            <div>
                React App
            </div>
        );
    }
}`;

export const indexTsxTemplate = `import * as React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('app'));`;

export const reduxIndexTsxTemplate = `import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import App from './App';
import store, { State } from './store';

const ConnectedApp = connect((state: State) => ({
}), (dispatch: Dispatch) => bindActionCreators({
}, dispatch))(App);

render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app'),
);`;

export const indexHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>React app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

export const actionsIndexTsx = `import { Action } from 'redux';

export interface ActionWithData<T extends string, P> extends Action<T> {
    payload: P;
}

/* eslint import/export: 0 */

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithData<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
    return payload === undefined ? { type } : ({ type, payload });
}

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
interface ActionCreatorMapObject { [actionCreator: string]: FunctionType }
export type ActionsUnion<A extends ActionCreatorMapObject> = ReturnType<A[keyof A]>;

// Example actions/counter.ts
/*
import { createAction, ActionsUnion } from '.';

export const counterActions = {
    reset: () => createAction('reset'),
    increment: (amount = 1) => createAction('increment', amount),
    decrement: (amount = 1) => createAction('decrement', amount),
}

export type CounterActions = ActionsUnion<typeof counterActions>;
*/

// Example reducers/counter.ts
/*
import { CounterActions } from '../actions/counter';

export const counter = (state = 0, action: CounterActions) => {
    switch (action.type) {
    case 'reset':
        return 0;
    case 'increment':
        return state + action.data;
    case 'decrement':
        return state - action.data;
    default:
        return state;
    }
}
*/
`;

export const reducersIndexTsx = `import { combineReducers } from 'redux';
// import { counter } from './counter';

export default combineReducers({
    // counter,
});`;

export const storeIndexTsx = `import { createStore } from 'redux';
import reducers from '../reducers';

export type State = ReturnType<typeof reducers>;

const store = createStore(reducers);

export default store;`;

export const exampleTest = `test('example  test', () => {
    expect(true).toBe(true);
});`;

export const jestConfig = {
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
    ],
    coverageDirectory: 'report',
    coverageReporters: [
        'json',
        'lcov',
        'text',
        'cobertura',
    ],
    coveragePathIgnorePatterns: [
        '/src/index.ts',
        '/src/actions/index.ts',
        '/src/reducers/index.ts',
        '/src/store/index.ts',
        '/src/App.ts',
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
    transform: {
        '.(ts|tsx)': 'ts-jest',
    },
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.js?(x)',
        '<rootDir>/src/**/?(*.)(spec|test).js?(x)',
        '<rootDir>/src/**/__tests__/**/*.ts?(x)',
        '<rootDir>/src/**/?(*.)(spec|test).ts?(x)',
    ],
    testEnvironment: 'node',
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!deepmerge).+\\.(js|jsx|ts|tsx)$',
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
};