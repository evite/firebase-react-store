import type { FirebaseOptions } from 'firebase/app';
import { Database } from 'firebase/database';
import { Auth } from 'firebase/auth';
import type { Persistence, UserCredential } from 'firebase/auth';
import { Document } from './document';
type Args = FirebaseOptions & {
    persistence?: Persistence;
};
export declare class RTDatabase {
    TIMESTAMP: object;
    fdb: Database;
    auth: Auth;
    authPersistence: Persistence;
    constructor({ persistence, ...config }: Args);
    get: (path: string) => Document;
    signInWithCustomToken: (token: string) => Promise<UserCredential>;
    goOffline: () => void;
    goOnline: () => void;
    signOut: () => Promise<void>;
}
export {};
