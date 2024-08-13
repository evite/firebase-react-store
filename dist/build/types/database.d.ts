import { firebase } from './firebase-init';
import { Document } from './document';
import type { FirebaseOptions } from 'firebase/app';
declare type Args = {
    config: FirebaseOptions;
    persistence?: firebase.auth.Auth.Persistence;
};
export declare class RTDatabase {
    TIMESTAMP: Object;
    fdb: firebase.database.Database;
    authPersistence: string;
    constructor({ persistence, ...config }: Args);
    get: (path: string) => Document;
    signInWithCustomToken: (token: string) => Promise<firebase.auth.UserCredential>;
    goOffline: () => any;
    goOnline: () => any;
    static signOut(): Promise<void>;
}
export {};
