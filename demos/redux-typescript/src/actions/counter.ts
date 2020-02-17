import { createAction, ActionsUnion } from '.';

export const counterActions = {
    reset: () => createAction('reset'),
    increment: (amount = 1) => createAction('increment', amount),
    decrement: (amount = 1) => createAction('decrement', amount),
}

export type CounterActions = ActionsUnion<typeof counterActions>;