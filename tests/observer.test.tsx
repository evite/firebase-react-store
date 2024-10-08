import React, {PureComponent} from 'react';
import renderer from 'react-test-renderer';
import {observer} from '../src';
import {rtdb} from './';

test('a component re-renders on changes', async () => {
  const doc = rtdb!.get('/re-renders-on-change');
  await doc.set({title: 'initial'});

  let renderCount = 0;

  @observer
  class ReactiveView extends PureComponent {
    render() {
      renderCount += 1;
      return <p>{doc.value.title}</p>;
    }
  }
  const element = <ReactiveView />;

  const testRender = renderer.create(element);
  const tree = testRender.toJSON();
  console.log(tree);
  expect(renderCount).toBe(1);
  // expect(tree.children[0]).toBe('initial');
  expect(doc._listeners.size).toBe(1);

  await doc.set({title: 'updated'});
  const updatedTree = testRender.toJSON();
  expect(renderCount).toBe(2);
  // expect(updatedTree.children[0]).toBe('updated');
});
