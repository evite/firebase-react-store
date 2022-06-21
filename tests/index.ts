import {TEST_FIREBASE_CONFIG} from './constants';
import {RTDatabase} from '../database';

export let rtdb = new RTDatabase(TEST_FIREBASE_CONFIG);

beforeAll(() => {
  rtdb = new RTDatabase(TEST_FIREBASE_CONFIG);
});

afterAll(() => {
  rtdb.fdb.goOffline();
  rtdb = null;
});
