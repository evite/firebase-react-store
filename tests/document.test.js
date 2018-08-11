import {view} from 'firebase-react-store';
import {rtdb} from './index';
import {NOT_SET} from 'firebase-react-store/constants';
import {Document} from '../src/document';

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

test('key works', async () => {
  const doc = rtdb.get('/a-key-doc');
  await doc.set({hmm: 1});
  expect(doc.key).toBe('a-key-doc');
});

test('document push returns a document', async () => {
  const doc = rtdb.get('/a-push-doc');
  const ret = await doc.push({hmm: 1});
  expect(ret).toBeInstanceOf(Document);
  await ret._valuePromise;
  expect(ret.value).toEqual({hmm: 1});
});
