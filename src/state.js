class State {
  /**
   * These are the functions active in the call stack that are currently
   * executing. This is used to track either accesses to Subjects and
   * (later) react to changes in them.
   */
  pendingViews = new Set();

  /**
   * Sometimes autorun views are used against subjects that have not yet
   * called the values handler, so we track them here and execute later.
   */
  incompleteViews = new Set();

  addPendingView = (view) => {
    this.pendingViews.add(view);
  };

  removePendingView = (view) => {
    this.pendingViews.delete(view);
  };
}

export const state = new State();
