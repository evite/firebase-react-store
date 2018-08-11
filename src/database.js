import {firebase} from './firebase-init';
import {auth} from '@firebase/auth';
import {Document} from './document';

export class RTDatabase {
  constructor(config) {
    firebase.initializeApp(config);

    /**
     * This is the real firebase database object from:
     *
     * See https://firebase.google.com/docs/reference/js/firebase.database.Database
     *
     * This is temporarily used internally until a full replacement
     * is written. `fdb` may not be available in future releases
     */
    this.fdb = firebase.database();

    this.TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
  }

  get = (path) => {
    return new Document(this, path);
  };

  signInWithCustomToken = (token) => {
    return firebase.auth().signInWithCustomToken(token);
  };
}
