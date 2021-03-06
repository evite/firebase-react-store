import React, {PureComponent} from 'react';
import renderer from 'react-test-renderer';
import {rtdb} from './index';
import {collectionObserver} from '../src';

test('render a collection', async () => {
  const doc = rtdb.get('/collection-render-a-collection');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver({database: rtdb, path: doc.path})
  class MessageCollection extends PureComponent {
    render() {
      expect(this.props.normal).toBe('on');
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection normal="on" />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  doc.close();
});

test('render a collection using props', async () => {
  const doc = rtdb.get('/collection-render-a-collection');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver()
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection database={rtdb} path={doc.path} />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  doc.close();
});

test('render last of a collection', async () => {
  const doc = rtdb.get('/collection-last-collection');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver({database: rtdb, path: doc.path, limitToLast: 5})
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('5,6,7,8,9');

  doc.close();
});

test('render first of a collection', async () => {
  const doc = rtdb.get('/collection-first-collection');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
    limitToFirst: 2,
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1');

  doc.close();
});

test('remove one from a collection', async () => {
  const doc = rtdb.get('/collection-remove-one');
  await doc.remove();
  let ref5 = null;
  for (let i = 0; i < 10; i++) {
    if (i === 5) {
      ref5 = await doc.push({message: i});
    } else {
      doc.push({message: i});
    }
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  await ref5.remove();

  output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,6,7,8,9');

  doc.close();
});

test('collectionObserver required props', async () => {
  let ran = false;
  let t = () => {
    ran = true;
    @collectionObserver()
    class MessageCollection extends PureComponent {}
    let testRender = renderer.create(element);
    let output = testRender.toJSON();
  };

  expect(t).toThrow();
  expect(ran).toBe(true);
});

test('collection handles modified child', async () => {
  const doc = rtdb.get('/collection-remove-one');
  await doc.remove();
  let doc5 = null;
  for (let i = 0; i < 10; i++) {
    if (i === 5) {
      doc5 = await doc.push({message: i});
    } else {
      doc.push({message: i});
    }
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  await doc5.set({message: 'updated'});

  output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,updated,6,7,8,9');

  doc.close();
});

test('order by child', async () => {
  const doc = rtdb.get('/collection-order-by-child');
  await doc.remove();
  for (let i = 9; i > 0; i--) {
    doc.push({message: i});
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
    orderByChild: 'message',
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('1,2,3,4,5,6,7,8,9');

  doc.close();
});

test('order by child', async () => {
  const doc = rtdb.get('/collection-order-by-child');
  await doc.remove();
  for (let i = 9; i > 0; i--) {
    await doc.push({message: i});
  }
  await doc.push({message: false});
  await doc.push({message: true});

  @collectionObserver({
    database: rtdb,
    path: doc.path,
    orderByChild: 'message',
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('false,true,1,2,3,4,5,6,7,8,9');

  // test adding
  await doc.push({message: false});
  await doc.push({message: true});
  output = testRender.toJSON();
  expect(output).toBe('false,false,true,true,1,2,3,4,5,6,7,8,9');

  // test child modification
  for (let key of Object.keys(doc.value)) {
    const value = doc.value[key];
    if (value.message === 5) {
      const five = rtdb.get('/collection-order-by-child/' + key);
      await five.set({message: 'test'});
      break;
    }
  }

  output = testRender.toJSON();
  expect(output).toBe('false,false,true,true,1,2,3,4,6,7,8,9,test');

  doc.close();
});

test('order by key', async () => {
  const doc = rtdb.get('/collection-order-by-child');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
    orderByKey: true,
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  doc.close();
});

test('order by value', async () => {
  const doc = rtdb.get('/collection-order-by-child');
  await doc.remove();
  for (let i = 0; i < 10; i++) {
    doc.push({message: i});
  }

  @collectionObserver({
    database: rtdb,
    path: doc.path,
    orderByValue: true,
  })
  class MessageCollection extends PureComponent {
    render() {
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5,6,7,8,9');

  doc.close();
});
