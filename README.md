# Firebase-react-store

Easily use Firebase like a store.

Often project that use Firebase will map data from the real-time
database into their own project store (or component) manually using
several React lifecycle methods.  Sometimes causing a two-way data
binding problem when processing updates to the local store and
reliably keeping both in sync.

Instead, FRS makes it possible to use Firebase through props just like
a store, without additional mapping or configuration.

## Quick introduction
### Connecting
```js
import {RTDatabase} from 'firebase-react-store';

// connect to Firebase
export const rtdb = new RTDatabase(firebase_config);
````

This example will connect to Firebase by creating a new instance of
`RTDatabase`. This is a reusable connection that should be shared
between components.

### Observing Documents

Documents describe a path in Firebase. They are created using `RTDatabase.get`:

```js
const group = rtdb.get('/some/group');
```

FRS also provides an `observer` decorator to easily react to changes
on a document.

```js
@observer
class View extends PureComponent {
  render() {
    return <p>{group.value.name}</p>;
  }
}
```

Accesses to documents by the render
function above will be tracked. When changes are made in the database,
the View component will re-render. This is a one-way mapping, which
keeps with the design philosophy of React. Also, there's no need to
use lifecycle methods in this example.

Documents can also be used to update data on Firebase through `set` and `push`:

```js
// set properties on this document
group.set({name: 'Updated Name'});

// or push new child nodes with a server-side key
group.push({name: 'New group'})
```

### Collections

```js
import {collectionObserver} from 'firebase-react-store';

@collectionObserver({database: rtdb, path: '/some/collection'})
class MessageCollection extends PureComponent {
  render() {
    return this.props.collection.map((v) => <Message message={v.value} />);
  }
}
```

The `collectionObserver` decorator will create a query and list the
nodes found at the path `/some/collection`.  When `collectionObserver`
is notified of a child being added or removed from the path, it will
cause `MessageCollection` to rerender.
