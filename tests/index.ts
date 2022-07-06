import {TEST_FIREBASE_CONFIG} from './constants';
import {RTDatabase} from '../src';

export let rtdb: RTDatabase | null = new RTDatabase(TEST_FIREBASE_CONFIG);

beforeAll(() => {
  rtdb = new RTDatabase(TEST_FIREBASE_CONFIG);
});

afterAll(() => {
  rtdb?.goOffline();
  rtdb = null;
});
