import React, {FunctionComponent, PureComponent} from 'react';
import firebase from 'firebase/compat/app';
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

type Query = firebase.database.Query;
type DataSnapshot = firebase.database.DataSnapshot;
type Reference = firebase.database.Reference;
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

      constructor(props: PropTypes) {
        super(props);
        this.state = {error: null};
        this.runQuery();

        const limitToLast = options.limitToLast || this.props.limitToLast;
        const limitToFirst = options.limitToFirst || this.props.limitToFirst;
        this.limit = limitToLast || limitToFirst || 50;
      }

      runQuery = () => {
        if (this.query) this.query.off();
        this.collection = [];

        const props = { ...this.props, ...options }
        const db = props.database;
        const path = props.path;

        if (!path) throw new Error("Collection requires a 'path' option.");
        if (!db) throw new Error("Collection requires a 'database' option.");

        const doc: Document = db.get(path);
        let query: Reference | Query = doc._ref;
        CollectionObserver.displayName = `collection-observer-${query.toString()}`;

        if (props.orderByKey) {
          query = query.orderByKey();
        }

        if (props.orderByValue) {
          query = query.orderByValue();
        }

        if (props.orderByChild) {
          query = query.orderByChild(props.orderByChild);
        }

        if (!!props.limitToLast) {
          query = query.limitToLast(props.limitToLast);
        }
        if (!!props.limitToFirst) {
          // @ts-ignore
          query = query.limitToFirst(limitToFirst);
        }

        this.query = query;
        if (this.mounted) this.listenToQuery();
      };

      listenToQuery = () => {
        this.query!.on('child_added', this.onChildAdded, this.onQueryError);
        this.query!.on('child_changed', this.onChildChanged, this.onQueryError);
        this.query!.on('child_removed', this.onChildRemoved, this.onQueryError);
        this.query!.on('child_moved', this.onChildMoved, this.onQueryError);
      };

      componentDidMount() {
        this.mounted = true;
        this.listenToQuery();
      }

      componentWillUnmount() {
        this.mounted = false;
        this.query!.off();
      }

      onQueryError = (error: unknown) => {
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
        const limitToLast = options.limitToLast || this.props.limitToLast;
        const limitToFirst = options.limitToFirst || this.props.limitToFirst;
        if (limitToLast) {
          options.limitToLast = limitToLast + this.limit;
        } else if (limitToFirst) {
          options.limitToFirst = limitToFirst + this.limit;
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
