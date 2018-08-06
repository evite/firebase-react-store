import React, {PureComponent} from 'react';

/**
 * This function/decorator creates a HOC that wraps the given
 * component and listens to collection events.
 *
 * Props passed to the wrapped component will include
 *
 * @param options
 */
export function collectionObserver(options) {
  options = options || {};

  const decorator = (component) => {
    class CollectionObserver extends PureComponent {
      static displayName = 'collection-observer-';

      constructor(props) {
        super(props);
        this.collection = [];

        const db = options.database || props.database;
        const path = options.path || props.path;
        if (!path) throw new Error("Collection requires a 'path' option.");
        if (!db) throw new Error("Collection requires a 'database' option.");

        const doc = db.get(path);
        let query = doc._ref;
        CollectionObserver.displayName = `collection-observer-${query.toString()}`;

        const limitToLast = options.limitToLast || props.limitToLast;
        if (limitToLast !== undefined) {
          query = query.limitToLast(limitToLast);
        }
        const limitToFirst = options.limitToFirst || props.limitToFirst;
        if (limitToFirst !== undefined) {
          query = query.limitToFirst(limitToFirst);
        }
        this.query = query;
      }

      componentDidMount() {
        this.query.on('child_added', this.onChildAdded);
        this.query.on('child_removed', this.onChildRemoved);
      }

      componentWillUnmount() {
        this.query.off();
      }

      onChildAdded = (childSnapshot, prevChildKey) => {
        const collection = this.collection;
        const newObj = {
          key: childSnapshot.key,
          value: childSnapshot.val(),
        };
        // if (collection.length === 0) {
        //   collection.push(newObj);
        //   return;
        // }

        // do we need? might be slow...
        // for (let idx = 0; idx < collection.length; idx++) {
        //   const obj = collection[idx];
        //   if (!obj) continue;
        //   if (idx + 1 === collection.length) continue; // do push instead
        //   if (obj.key === prevChildKey) {
        //     collection.slice(idx + 1, 0, newObj);
        //     this.setState({collection: collection});
        //     return;
        //   }
        // }

        collection.push(newObj);
        this.forceUpdate();
      };

      onChildRemoved = (oldChildSnapshot) => {
        for (let idx = 0; idx < this.collection.length; idx++) {
          const obj = this.collection[idx];
          if (!obj) continue;
          if (oldChildSnapshot.key === obj.key) {
            this.collection.splice(idx, 1);
            this.forceUpdate();
            return;
          }
        }
      };

      render() {
        const newProps = {
          collection: this.collection.slice(),
        };
        return React.createElement(component, newProps);
      }
    }

    return CollectionObserver;
  };

  return decorator;
}
