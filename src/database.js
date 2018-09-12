import {firebase} from './firebase-init';
import {auth} from '@firebase/auth';
import {Document} from './document';

export class RTDatabase {
  TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

  // auth persistence modes, see https://firebase.google.com/docs/auth/web/auth-state-persistence
  static persistence = {
    NONE: 'none',
    LOCAL: 'local',
    SESSION: 'session',
  };

  constructor(config) {
    this.authPersistence = config.persistence || RTDatabase.persistence.NONE;
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
    return new Document(this, path);
  };

  signInWithCustomToken = async (token) => {
    await firebase.auth().setPersistence(this.authPersistence);
    return firebase.auth().signInWithCustomToken(token);
  };

  goOffline = () => {
    return this.fdb.goOffline();
  };

  goOnline = () => {
    return this.fdb.goOnline();
  };

  static signOut() {
    return firebase.auth().signOut();
  }
}
