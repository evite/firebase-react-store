import {view} from 'firebase-react-store';
import {rtdb} from './index';
import {NOT_SET} from 'firebase-react-store/constants';

test('write and receive updates for an int', async () => {
  const subject = rtdb.get('/a');
  subject.set({b: 0});

  let resolvers = [];
  let promises = [
    new Promise((resolve, reject) => (resolvers[0] = resolve)),
    new Promise((resolve, reject) => (resolvers[1] = resolve)),
  ];
  const disposer = view(() => {
    resolvers[subject.b]();
  });
  // our view should be a listener now
  expect(subject._listeners.size).toBe(1);

  await promises[0];

  await subject.update({b: 1});
  await promises[1];

  disposer();
});

test('test incomplete view', async () => {
  const subject = rtdb.get('/b');

  let resolvers = [];
  let promises = [
    new Promise((resolve, reject) => (resolvers[0] = resolve)),
    new Promise((resolve, reject) => (resolvers[1] = resolve)),
  ];
  const disposer = view(() => {
    resolvers[subject.b]();
  });
  // no values have been set yet, so the view should not have been
  // able to actually complete
  expect(subject._values).toBe(NOT_SET);

  // but the view should be a listener
  expect(subject._listeners.size).toBe(1);

  await subject.set({b: 0});
  await promises[0];

  await subject.set({b: 1});
  await promises[1];

  disposer();
});
