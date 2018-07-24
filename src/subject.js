import {NOT_SET} from './constants';
import {state} from './state';

class Subject {
  constructor(ref) {
    this._ref = ref;
    this._values = NOT_SET;
    this._listeners = new Set();
    this._valueFuture = new Promise(this._resolveValues);
  }

  _resolveValues = () => {};

  onValues = (response) => {
    this._values = response.val();
    this._resolveValues();

    for (let listener of this._listeners) {
      try {
        listener();
      } catch (e) {
        console.error(e);
      }
    }
  };

  close = () => {
    this.ref && this.ref.off('value');
  };
}

const proxyHandler = {
  get: (subject, name) => {
    // add all pending views (they are in the call stack
    // somewhere) as a listener
    for (let func of state.pendingViews) {
      subject._listeners.add(func);
      let subjects = func._subjects;
      if (subjects === undefined) {
        subjects = func._subjects = new Set();
      }
      subjects.add(subject);
    }

    if (subject.hasOwnProperty(name)) {
      return subject[name];
    }

    if (subject._values === NOT_SET) {
      throw NOT_SET;
    }
    return subject._values[name];
  },
};

/**
 * Create a new Subject with ref observable
 *
 * @param db RTDatabase instance
 * @param path
 */
export function subject(db, path) {
  const ref = db.fdb.ref(path);
  const subject = new Subject(ref);
  ref.on('value', subject.onValues);
  return new Proxy(subject, proxyHandler);
}
