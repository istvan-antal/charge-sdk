import * as React from 'react';
import { connect } from 'react-redux';
import { State } from './store';
import { counterActions, CounterActions } from './actions/counter';
import { Dispatch, bindActionCreators } from 'redux';

interface Props {
    counter: State['counter'];
    reset: typeof counterActions.reset;
    increment: typeof counterActions.increment;
    decrement: typeof counterActions.decrement;
}

class App extends React.Component<Props> {
    render() {
        return (
            <div className="App">
                <input className="CountDisplay" value={this.props.counter} />
                <button onClick={() => { this.props.decrement(); }}>-</button>
                <button onClick={() => { this.props.increment(); }}>+</button>
                <button onClick={this.props.reset}>reset</button>
            </div>
        );
    }
}

/*
const mapDispatchToProps = (dispatch: Dispatch<AllActions>): {
} => ({
    actions: bindActionCreators({
    }, dispatch),
});
*/
export default connect((state: State) => ({
    counter: state.counter,
}), (dispatch: Dispatch<CounterActions>) => bindActionCreators({
    reset: counterActions.reset,
    increment: counterActions.increment,
    decrement: counterActions.decrement,
}, dispatch))(App);