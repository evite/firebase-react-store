import {firebase} from './firebase-init';
import {Document} from './document';
import type {FirebaseOptions} from 'firebase/app';

type Args = { config: FirebaseOptions, persistence?: firebase.auth.Auth.Persistence }

export class RTDatabase {
  TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
  fdb: firebase.database.Database;
  authPersistence: string;

  constructor({ persistence, ...config} : Args) {
    this.authPersistence = persistence || firebase.auth.Auth.Persistence.NONE;
    firebase.initializeApp(config);
    this.fdb = firebase.database();
  }

  get = (path: string): Document => {
    return new Document(this, path);
  };

  signInWithCustomToken = async (token: string): Promise<firebase.auth.UserCredential> => {
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
