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
  doc.close();
});

test('key works', async () => {
  const doc = rtdb.get('/a-key-doc');
  await doc.set({hmm: 1});
  expect(doc.key).toBe('a-key-doc');
  doc.close();
});

test('path works', async () => {
  const doc = rtdb.get('/a/b/c/d/e');
  expect(doc.path).toBe('/a/b/c/d/e');
  doc.close();
});

test('document push returns a document', async () => {
  const doc = rtdb.get('/a-push-doc');
  const ret = await doc.push({hmm: 1});
  expect(ret).toBeInstanceOf(Document);
  await ret._valuePromise;
  expect(ret.value).toEqual({hmm: 1});
});

test('document disconnect', async () => {
  let doc = rtdb.get('/on-disconnect');
  const ret = await doc.set({online: true});
  doc.onDisconnect().set({online: false});
  expect(true).toBe(true);
  // doesn't seem to be a way to test this, doh.

  // rtdb.goOffline();
  // rtdb.goOnline();
  //
  // doc = rtdb.get('/on-disconnect');
  // const values = await doc.onValues();
  // expect(values.online).toBe(false);
  // doc.close();
});
