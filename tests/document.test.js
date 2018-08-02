import {view} from 'firebase-react-store';
import {rtdb} from './index';
import {NOT_SET} from 'firebase-react-store/constants';

test('uninitialized subject throws NOT_SET', async () => {
  const doc = rtdb.get('/c');
  expect(() => {
    console.log(doc.value.asdf);
  }).toThrow();

  doc.close();
});

test('remove a subject', async () => {
  const doc = rtdb.get('/remove-a-subject');
  await doc.remove();
  await doc.set({hmm: 1});
  expect((await doc.onValues()).hmm).toBe(1);
});
