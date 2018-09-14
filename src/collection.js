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
        this.state = {error: null};
        this.runQuery();
      }

      runQuery = () => {
        if (this.query) this.query.off();
        this.collection = [];

        const db = options.database || this.props.database;
        const path = options.path || this.props.path;
        if (!path) throw new Error("Collection requires a 'path' option.");
        if (!db) throw new Error("Collection requires a 'database' option.");

        const doc = db.get(path);
        let query = doc._ref;
        CollectionObserver.displayName = `collection-observer-${query.toString()}`;

        const orderByKey = options.orderByKey || this.props.orderByKey;
        if (orderByKey) {
          query = query.orderByKey();
        }
        const orderByValue = options.orderByValue || this.props.orderByValue;
        if (orderByValue) {
          query = query.orderByValue();
        }
        const orderByChild = options.orderByChild || this.props.orderByChild;
        if (orderByChild) {
          query = query.orderByChild(orderByChild);
        }
        const limitToLast = options.limitToLast || this.props.limitToLast;
        if (limitToLast !== undefined) {
          query = query.limitToLast(limitToLast);
        }
        const limitToFirst = options.limitToFirst || this.props.limitToFirst;
        if (limitToFirst !== undefined) {
          query = query.limitToFirst(limitToFirst);
        }
        this.query = query;
        if (this.mounted) this.listenToQuery();
      };

      listenToQuery = () => {
        this.query.on('child_added', this.onChildAdded, this.onQueryError);
        this.query.on('child_changed', this.onChildChanged, this.onQueryError);
        this.query.on('child_removed', this.onChildRemoved, this.onQueryError);
        this.query.on('child_moved', this.onChildMoved, this.onQueryError);
      };

      componentDidMount() {
        this.mounted = true;
        this.listenToQuery();
      }

      componentWillUnmount() {
        this.mounted = false;
        this.query.off();
      }

      onQueryError = (error) => {
        this.setState({error: error});
      };

      onChildAdded = (childSnapshot, prevChildKey) => {
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

      onChildMoved = () => {
        this.runQuery();
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
