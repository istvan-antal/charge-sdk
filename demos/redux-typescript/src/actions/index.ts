export interface Action<T extends string> {
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