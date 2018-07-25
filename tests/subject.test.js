import {view} from 'mobase';
import {rtdb} from './index';
import {NOT_SET} from 'mobase/constants';

test('uninitialized subject throws NOT_SET', async () => {
  const subject = rtdb.get('/c');
  expect(() => {
    console.log(subject.asdf);
  }).toThrow();

  subject.close();
});

test('remove a subject', async () => {
  const subject = rtdb.get('/remove-a-subject');
  await subject.remove();
  await subject.set({hmm: 1});
  expect((await subject.values()).hmm).toBe(1);
});
