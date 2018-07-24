import {RTDatabase, autorun, subject} from 'mobase';
import {TEST_FIREBASE_CONFIG} from './constants';

test('write and receive updates for an int', async () => {
  const db = new RTDatabase(TEST_FIREBASE_CONFIG);

  const ref = db.fdb.ref('/a');
  ref.set({b: 0});
  const subject = await db.get('/a');

  let resolvers = [];
  let promises = [
    new Promise((resolve, reject) => (resolvers[0] = resolve)),
    new Promise((resolve, reject) => (resolvers[1] = resolve)),
  ];
  const disposer = autorun(() => {
    resolvers[subject.b]();
  });
  // our autorun view should be a listener now
  expect(subject._listeners.size).toBe(1);

  await promises[0];

  await ref.set({b: 1});
  await promises[1];

  disposer();
  db.fdb.goOffline();
});
