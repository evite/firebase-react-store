import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseOptions, FirebaseApp } from 'firebase/app';
import { getDatabase, goOffline, goOnline, serverTimestamp, Database } from 'firebase/database';
import {
  getAuth,
  setPersistence,
  signInWithCustomToken,
  signOut,
  inMemoryPersistence,
  Auth,
} from 'firebase/auth';
import type { Persistence, UserCredential } from 'firebase/auth';
import { Document } from './document';

type Args = FirebaseOptions & { persistence?: Persistence };

export class RTDatabase {
  TIMESTAMP = serverTimestamp();
  fdb: Database;
  auth: Auth;
  authPersistence: Persistence;

  constructor({ persistence, ...config }: Args) {
    this.authPersistence = persistence || inMemoryPersistence;
    const app: FirebaseApp = getApps().length === 0
      ? initializeApp(config)
      : getApp();
    this.fdb = getDatabase(app);
    this.auth = getAuth(app);
  }

  get = (path: string): Document => {
    return new Document(this, path);
  };

  signInWithCustomToken = async (token: string): Promise<UserCredential> => {
    await setPersistence(this.auth, this.authPersistence);
    return signInWithCustomToken(this.auth, token);
  };

  goOffline = () => {
    return goOffline(this.fdb);
  };

  goOnline = () => {
    return goOnline(this.fdb);
  };

  signOut = () => {
    return signOut(this.auth);
  };
}
