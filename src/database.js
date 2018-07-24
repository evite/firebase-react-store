import {firebase} from './firebase-init';
import {subject} from './subject';

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
  }

  get = (path) => {
    return subject(this, path);
  };
}
