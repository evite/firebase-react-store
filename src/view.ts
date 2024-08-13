import {state} from './state';
import {NOT_SET} from './constants';

export function dispose(func: () => void) {
  // @ts-ignore
  const documents = func._documents;
  if (!documents) return;
  for (let doc of documents) {
    doc._listeners.delete(func);
    if (doc._listeners.size === 0) {
      doc.close();
    }
  }
}

function disposer(func: () => void) {
  return () => {
    dispose(func);
  };
}

/**
 * `view` will execute the function immediately and will
 * track data accesses made through `ref` and re-execute the function
 * when a tracked database value changes.
 *
 * @param func
 */
export function view(func: () => void) {
  // begin tracking accesses to state
  state.addPendingView(func);

  try {
    func();
  } catch (e) {
    if (e !== NOT_SET) {
      // values are not set yet, but the access should
      // have been added to the document's listener list already,
      // so it'll just react later.
      throw e;
    }
  } finally {
    state.removePendingView(func);
  }

  return disposer(func);
}
