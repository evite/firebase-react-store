class State {
  /**
   * These are the functions active in the call stack that are currently
   * executing. This is used to track either accesses to Documents and
   * (later) react to changes in them.
   */
  pendingViews = new Set();

  addPendingView = (view) => {
    this.pendingViews.add(view);
  };

  removePendingView = (view) => {
    this.pendingViews.delete(view);
  };
}

export const state = new State();
