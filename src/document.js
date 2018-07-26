import {NOT_SET} from './constants';
import {state} from './state';

class Document {
  constructor(ref) {
    this._ref = ref;
    this._values = NOT_SET;
    this._listeners = new Set();
    this._valuePromise = new Promise((resolve) => {
      this._resolveValues = resolve;
    });
  }

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

  values = async () => {
    await this._valuePromise;
    return Object.assign({}, this._values);
  };

  /**
   * Set a value, replacing whatever value is already present.
   *
   * To update specific fields use `update`.
   *
   * @param values:Object of properties to set
   * @returns Promise
   */
  set = (values) => {
    return this._ref.set(values);
  };

  /**
   * Update specific fields
   *
   * @param values:Object of properties to set
   * @returns Promise
   */
  update = (values) => {
    return this._ref.update(values);
  };

  /**
   * Remove the path referred to by this document. This will also remove
   * any child nodes of the current path.
   *
   * @returns Promise
   */
  remove = () => {
    return this._ref.remove();
  };

  close = () => {
    this.ref && this.ref.off('value');
  };
}

const proxyHandler = {
  get: (document, name) => {
    // add all pending views (they are in the call stack
    // somewhere) as a listener
    for (let func of state.pendingViews) {
      document._listeners.add(func);
      let documents = func._documents;
      if (documents === undefined) {
        documents = func._documents = new Set();
      }
      documents.add(document);
    }

    if (document.hasOwnProperty(name)) {
      return document[name];
    }

    if (document._values === NOT_SET) {
      throw NOT_SET;
    }
    return document._values[name];
  },
};

/**
 * Create a new Document with ref observable
 *
 * @param db RTDatabase instance
 * @param path
 */
export function document(db, path) {
  const ref = db.fdb.ref(path);
  const doc = new Document(ref);
  ref.on('value', doc.onValues);
  return new Proxy(doc, proxyHandler);
}
