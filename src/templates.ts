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

export const reduxIndexTsxTemplate = `import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

// Replace this with actual actions union
type Actions = any;
import { connect } from 'react-redux';
import { State } from './store';
import { Dispatch, bindActionCreators } from 'redux';
const ConnectedApp = connect((state: State) => ({
}), (dispatch: Dispatch<Actions>) => bindActionCreators({
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

export const actionsIndexTsx = `export interface Action<T extends string> {
    type: T;
}

export interface ActionWithData<T extends string, P> extends Action<T> {
    data: P;
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, data: P): ActionWithData<T, P>
export function createAction<T extends string, P>(type: T, data?: P) {
    return data === undefined ? { type } : ({ type, data });
}

type FunctionType = (...args: any[]) => any;
type ActionCreatorMapObject = { [actionCreator: string]: FunctionType };
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