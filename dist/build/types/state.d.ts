declare class State {
    /**
     * These are the functions active in the call stack that are currently
     * executing. This is used to track either accesses to Documents and
     * (later) react to changes in them.
     */
    pendingViews: Set<unknown>;
    addPendingView: (view: () => void) => void;
    removePendingView: (view: () => void) => void;
}
export declare const state: State;
export {};
