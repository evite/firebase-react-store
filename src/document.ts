import firebase from 'firebase/compat/app';
import {NOT_SET} from './constants';
import {state} from './state';
import {RTDatabase} from './database';


type DatabaseReference = firebase.database.Reference;
type DataSnapshot = firebase.database.DataSnapshot;

export class Document {
  _ref: DatabaseReference;
  _valuePromise: Promise<any>;
  // @ts-ignore
  _resolveValues: (value?: unknown) => void;
  // @ts-ignore
  _rejectValues: (error: unknown) => void;
  _listeners: Set<any>;
  _value: any;

  constructor(reference: RTDatabase | DatabaseReference, path?: string) {
    if (!path) {
      this._ref = reference as DatabaseReference;
    } else {
      this._ref = (reference as RTDatabase).fdb.ref(path);
    }
    this._value = NOT_SET;
    this._listeners = new Set();
    this._valuePromise = new Promise((resolve, reject) => {
      this._resolveValues = resolve;
      this._rejectValues = reject;
    });

    this._ref.on('value', this._onValueHandler, this._onErrorHandler);
  }

  _onValueHandler = (response: DataSnapshot) => {
    this._value = response.val();
    this._resolveValues();

    for (let listener of this._listeners) {
      try {
        listener();
      } catch (e) {
        console.error(e);
      }
    }
  };

  _onErrorHandler = (error: unknown) => {
    this._rejectValues(error);
  };

  get key() {
    return this._ref.key;
  }

  get value() {
    // add all pending views (they are in the call stack
    // somewhere) as a listener
    state.pendingViews.forEach((func: any) => {
      this._listeners.add(func);
      let documents = func._documents;
      if (documents === undefined) {
        documents = func._documents = new Set();
      }
      documents.add(this);
    });

    if (this._value === NOT_SET) throw NOT_SET;
    return this._value;
  }

  get path() {
    return this._ref.toString().substring(this._ref.root.toString().length - 1);
  }

  onValues = async (): Promise<unknown> => {
    await this._valuePromise;
    return Object.assign({}, this._value);
  };

  /**
   * Set a value, replacing whatever value is already present.
   *
   * To update specific fields use `update`.
   *
   * @param values:Object of properties to set
   * @returns Promise
   */
  set = (values: unknown) => {
    return this._ref.set(values);
  };

  /**
   * Push a new child value without conflicts
   *
   * @param obj
   * @returns Promise
   */
  push = async (obj: unknown) => {
    const ref = await this._ref.push(obj);
    return new Document(ref);
  };

  /**
   * Update specific fields
   *
   * @param values:Object of properties to set
   * @returns Promise
   */
  update = (values: object) => {
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

  onDisconnect = () => {
    return this._ref.onDisconnect();
  };

  close = () => {
    this._ref && this._ref.off('value');
  };
}
