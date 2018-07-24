import {TEST_FIREBASE_CONFIG} from './constants';
import {RTDatabase} from 'mobase';

export let rtdb = null;

beforeAll(() => {
  rtdb = new RTDatabase(TEST_FIREBASE_CONFIG);
});

afterAll(() => {
  rtdb.fdb.goOffline();
  rtdb = null;
});
