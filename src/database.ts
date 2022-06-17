import {FirebaseOptions, initializeApp} from 'firebase/app';
import {getDatabase, Database, goOffline, goOnline} from 'firebase/database';
import {getAuth, signInWithCustomToken, signOut, Persistence} from 'firebase/auth';
import {Document} from './document';


export class RTDatabase {
  fdb: Database
  authPersistence: Persistence

  // auth persistence modes, see https://firebase.google.com/docs/auth/web/auth-state-persistence
  static persistence = {
    NONE: 'none',
    LOCAL: 'local',
    SESSION: 'session',
  };

  constructor(config: FirebaseOptions, persistence: Persistence) {
    const app = initializeApp(config);
    this.authPersistence = persistence || RTDatabase.persistence.NONE;
    this.fdb = getDatabase(app);
  }

  get = (path: string) => {
    return new Document(this, path);
  };

  signInWithCustomToken = async (token: string) => {
    const auth = getAuth();
    await auth.setPersistence(this.authPersistence)
    return signInWithCustomToken(auth, token)
  };

  goOffline = () => {
    return goOffline(this.fdb);
  };

  goOnline = () => {
    return goOnline(this.fdb);
  };

  static signOut() {
    const auth = getAuth();
    return signOut(auth);
  }
}
