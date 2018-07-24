import {state} from './state';
import {NOT_SET} from './constants';

function disposer(func) {
  return () => {
    const subjects = func._subjects;
    if (!subjects) return;
    for (let subject of subjects) {
      subject._listeners.delete(func);
      if (subject._listeners.size === 0) {
        // if the subject doesn't have any listeners, we
        // should be able to turn it off? todo
        subject.close();
      }
    }
  };
}

/**
 * Autorun will execute the function immediately and will
 * track data accesses made through `ref` and re-execute the function
 * when a tracked database value changes.
 *
 * @param func
 */
export function autorun(func) {
  // begin tracking accesses to state
  state.addPendingView(func);

  try {
    func();
  } catch (e) {
    if (e === NOT_SET) {
      console.log('view not complete');
      state.incompleteViews.add(func);
    }
    throw e;
  } finally {
    state.removePendingView(func);
  }

  return disposer(func);
}
