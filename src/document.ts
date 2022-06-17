import { ref, set, push, onValue, update, remove, onDisconnect, off } from "firebase/database";
import type { DatabaseReference, DataSnapshot } from "firebase/database";
import {NOT_SET} from './constants';
import {state} from './state';
import {RTDatabase} from './database';


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
      this._ref = ref((reference as RTDatabase).fdb, path);
    }
    this._value = NOT_SET;
    this._listeners = new Set();
    this._valuePromise = new Promise((resolve, reject) => {
      this._resolveValues = resolve;
      this._rejectValues = reject;
    });

    onValue(this._ref, this._onValueHandler, this._onErrorHandler);
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
    })

    if (this._value === NOT_SET) throw NOT_SET;
    return this._value;
  }

  get path() {
    return this._ref.toString().substring(this._ref.root.toString().length - 1);
  }

  onValues = async () => {
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
    return set(this._ref, values);
  };

  /**
   * Push a new child value without conflicts
   *
   * @param obj
   * @returns Promise
   */
  push = async (obj: unknown) => {
    const ref = push(this._ref, obj);
    return new Document(ref);
  };

  /**
   * Update specific fields
   *
   * @param values:Object of properties to set
   * @returns Promise
   */
  update = (values: object) => {
    return update(this._ref, values);
  };

  /**
   * Remove the path referred to by this document. This will also remove
   * any child nodes of the current path.
   *
   * @returns Promise
   */
  remove = () => {
    return remove(this._ref);
  };

  onDisconnect = () => {
    return onDisconnect(this._ref);
  };

  close = () => {
    this._ref && off(this._ref);
  };
}
