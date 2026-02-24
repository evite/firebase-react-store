import React, {FunctionComponent, PureComponent} from 'react';
import {
  query,
  orderByKey,
  orderByValue,
  orderByChild,
  limitToLast,
  limitToFirst,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onChildMoved,
} from 'firebase/database';
import type { Query, DataSnapshot, Unsubscribe } from 'firebase/database';
import {RTDatabase} from './database';
import {Document} from './document';

type Args = {
  database?: RTDatabase;
  path?: string;
  orderByKey?: boolean;
  orderByValue?: boolean;
  orderByChild?: string;
  limitToLast?: number;
  limitToFirst?: number;
}

type PropTypes = Args;

/**
 * This function/decorator creates a HOC that wraps the given
 * component and listens to collection events.
 *
 * Props passed to the wrapped component will include
 *
 * @param options
 */
export const collectionObserver: (options?: Args) => (component: React.FunctionComponent<PropTypes>) => any = (options: Args = {}) => {
  const decorator = (component: FunctionComponent<PropTypes>) => {
    class CollectionObserver extends PureComponent<PropTypes, { error: unknown }> {
      static displayName = 'collection-observer-';
      mounted?: boolean;
      query?: Query;
      limit: number;
      collection: any[] = [];
      _unsubs: Unsubscribe[] = [];

      constructor(props: PropTypes) {
        super(props);
        this.state = {error: null};
        this.runQuery();

        const _limitToLast = options.limitToLast || this.props.limitToLast;
        const _limitToFirst = options.limitToFirst || this.props.limitToFirst;
        this.limit = _limitToLast || _limitToFirst || 50;
      }

      runQuery = () => {
        this._unsubAll();
        this.collection = [];

        const props = { ...this.props, ...options }
        const db = props.database;
        const path = props.path;

        if (!path) throw new Error("Collection requires a 'path' option.");
        if (!db) throw new Error("Collection requires a 'database' option.");

        const doc: Document = db.get(path);
        const baseRef = doc._ref;
        CollectionObserver.displayName = `collection-observer-${baseRef.toString()}`;

        const constraints: any[] = [];

        if (props.orderByKey) {
          constraints.push(orderByKey());
        }

        if (props.orderByValue) {
          constraints.push(orderByValue());
        }

        if (props.orderByChild) {
          constraints.push(orderByChild(props.orderByChild));
        }

        if (!!props.limitToLast) {
          constraints.push(limitToLast(props.limitToLast));
        }
        if (!!props.limitToFirst) {
          constraints.push(limitToFirst(props.limitToFirst));
        }

        this.query = query(baseRef, ...constraints);
        if (this.mounted) this.listenToQuery();
      };

      _unsubAll = () => {
        for (const unsub of this._unsubs) {
          unsub();
        }
        this._unsubs = [];
      };

      listenToQuery = () => {
        this._unsubs.push(
          onChildAdded(this.query!, this.onChildAdded, this.onQueryError),
          onChildChanged(this.query!, this.onChildChanged, this.onQueryError),
          onChildRemoved(this.query!, this.onChildRemoved, this.onQueryError),
          onChildMoved(this.query!, this.onChildMoved, this.onQueryError),
        );
      };

      componentDidMount() {
        this.mounted = true;
        this.listenToQuery();
      }

      componentWillUnmount() {
        this.mounted = false;
        this._unsubAll();
      }

      onQueryError = (error: Error) => {
        this.setState({error: error});
      };

      onChildAdded = (childSnapshot: DataSnapshot, prevChildKey?: string | null) => {
        const newObj = {
          key: childSnapshot.key,
          value: childSnapshot.val(),
        };

        let previousFound = false;
        if (prevChildKey) {
          for (let i = 0; i < this.collection.length - 1; i++) {
            let obj = this.collection[i];
            if (obj.key === prevChildKey) {
              previousFound = true;
              this.collection.splice(i + 1, 0, newObj);
            }
          }
        }

        if (!previousFound) {
          this.collection.push(newObj);
        }
        this.mounted && this.forceUpdate();
      };

      onChildChanged = (snapshot: DataSnapshot) => {
        for (let idx = 0; idx < this.collection.length; idx++) {
          const obj = this.collection[idx];
          if (!obj) continue;
          if (snapshot.key === obj.key) {
            obj.value = snapshot.val();
            this.mounted && this.forceUpdate();
            return;
          }
        }
      };

      onChildRemoved = (oldChildSnapshot: DataSnapshot) => {
        for (let idx = 0; idx < this.collection.length; idx++) {
          const obj = this.collection[idx];
          if (!obj) continue;
          if (oldChildSnapshot.key === obj.key) {
            this.collection.splice(idx, 1);
            this.mounted && this.forceUpdate();
            return;
          }
        }
      };

      onChildMoved = (snapshot: DataSnapshot, previousChildKey?: string | null) => {
        const newCollection = [];
        let movedItem: object | null = {key: snapshot.key, value: snapshot.val()};

        for (let item of this.collection) {
          if (item.key === snapshot.key) {
            continue;
          }
          newCollection.push(item);
          if (item.key === previousChildKey) {
            newCollection.push(movedItem);
            movedItem = null;
          }
        }

        if (movedItem) newCollection.push(movedItem);
        this.collection = newCollection;
      };

      /**
       * Add to the collection in the direction of the query
       *
       * This is meant to be used by infinite scrolling components
       */
      onScroll = () => {
        const _limitToLast = options.limitToLast || this.props.limitToLast;
        const _limitToFirst = options.limitToFirst || this.props.limitToFirst;
        if (_limitToLast) {
          options.limitToLast = _limitToLast + this.limit;
        } else if (_limitToFirst) {
          options.limitToFirst = _limitToFirst + this.limit;
        }
        this.runQuery();
      };

      setLimitToLast = (limit: number) => {
        options.limitToLast = limit;
        this.runQuery();
      };

      setLimitToFirst = (limit: number) => {
        options.limitToFirst = limit;
        this.runQuery();
      };

      render() {
        const newProps = Object.assign({}, this.props, {
          collection: this.collection.slice(),
          scrollCollection: this.onScroll,
          setLimitToLast: this.setLimitToLast,
          setLimitToFirst: this.setLimitToFirst,
          collectionError: this.state.error,
        });
        return React.createElement(component, newProps);
      }
    }

    return CollectionObserver;
  };

  return decorator;
};
