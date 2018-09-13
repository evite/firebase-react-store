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
        this.state = {error: null};

        const db = options.database || props.database;
        const path = options.path || props.path;
        if (!path) throw new Error("Collection requires a 'path' option.");
        if (!db) throw new Error("Collection requires a 'database' option.");

        const doc = db.get(path);
        let query = doc._ref;
        CollectionObserver.displayName = `collection-observer-${query.toString()}`;

        const orderByKey = options.orderByKey || props.orderByKey;
        if (orderByKey) {
          query = query.orderByKey();
        }
        const orderByValue = options.orderByValue || props.orderByValue;
        if (orderByValue) {
          query = query.orderByValue();
        }
        const orderByChild = options.orderByChild || props.orderByChild;
        if (orderByChild) {
          query = query.orderByChild(orderByChild);
        }
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
        this.mounted = true;
        this.query.on('child_added', this.onChildAdded, this.onQueryError);
        this.query.on('child_changed', this.onChildChanged, this.onQueryError);
        this.query.on('child_removed', this.onChildRemoved, this.onQueryError);
      }

      componentWillUnmount() {
        this.mounted = false;
        this.query.off();
      }

      onQueryError = (error) => {
        this.setState({error: error});
      };

      onChildAdded = (childSnapshot, prevChildKey) => {
        const collection = this.collection;
        const newObj = {
          key: childSnapshot.key,
          value: childSnapshot.val(),
        };

        collection.push(newObj);
        this.mounted && this.forceUpdate();
      };

      onChildChanged = (snapshot) => {
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

      onChildRemoved = (oldChildSnapshot) => {
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

      render() {
        const newProps = Object.assign({}, this.props, {
          collection: this.collection.slice(),
        });
        newProps.collectionError = this.state.error;
        return React.createElement(component, newProps);
      }
    }

    return CollectionObserver;
  };

  return decorator;
}
