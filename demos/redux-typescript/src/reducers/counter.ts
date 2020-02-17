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