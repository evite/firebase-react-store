class State {
  /**
   * These are the functions active in the call stack that are currently
   * executing. This is used to track either accesses to Documents and
   * (later) react to changes in them.
   */
  pendingViews = new Set();

  addPendingView = (view: () => void) => {
    this.pendingViews.add(view);
  };

  removePendingView = (view: () => void) => {
    this.pendingViews.delete(view);
  };
}

export const state = new State();
