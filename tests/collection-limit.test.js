import React, {PureComponent} from 'react';
import renderer from 'react-test-renderer';
import {rtdb} from './index';
import {collectionObserver} from '../src';

test('render and scrollBack', async () => {
  const doc = rtdb.get('/collection-render-scroll-back');
  await doc.remove();
  let messageCount = 0;
  for (; messageCount < 10; messageCount++) {
    doc.push({message: messageCount});
  }

  let doScroll, setLimit;

  @collectionObserver({database: rtdb, path: doc.path, limitToLast: 2})
  class MessageCollection extends PureComponent {
    render() {
      doScroll = this.props.scrollCollection;
      setLimit = this.props.setLimitToLast;
      expect(this.props.normal).toBe('on');
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection normal="on" />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('8,9');

  // 2 more should be added to the collection
  doScroll();
  output = testRender.toJSON();
  expect(output).toBe('6,7,8,9');

  // 2 more should be added to the collection
  doScroll();
  output = testRender.toJSON();
  expect(output).toBe('4,5,6,7,8,9');

  setLimit(2);
  output = testRender.toJSON();
  expect(output).toBe('8,9');

  doc.close();
});

test('render and scroll forward', async () => {
  const doc = rtdb.get('/collection-render-scroll-forward');
  await doc.remove();
  let messageCount = 0;
  for (; messageCount < 10; messageCount++) {
    doc.push({message: messageCount});
  }

  let doScroll, setLimit;

  @collectionObserver({database: rtdb, path: doc.path, limitToFirst: 2})
  class MessageCollection extends PureComponent {
    render() {
      setLimit = this.props.setLimitToFirst;
      doScroll = this.props.scrollCollection;
      expect(this.props.normal).toBe('on');
      return this.props.collection.map((v) => v.value.message).join();
    }
  }

  const element = <MessageCollection normal="on" />;
  let testRender = renderer.create(element);
  let output = testRender.toJSON();
  expect(output).toBe('0,1');

  // 2 more should be added to the collection
  doScroll();
  output = testRender.toJSON();
  expect(output).toBe('0,1,2,3');

  // 2 more should be added to the collection
  doScroll();
  output = testRender.toJSON();
  expect(output).toBe('0,1,2,3,4,5');

  setLimit(2);
  output = testRender.toJSON();
  expect(output).toBe('0,1');

  doc.close();
});
