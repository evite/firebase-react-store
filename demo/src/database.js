import {RTDatabase} from 'firebase-react-store';

export const CONFIG = {
  apiKey: 'test',
  databaseURL: `ws://localhost:5555`,
};

export let rtdb = new RTDatabase(CONFIG);
