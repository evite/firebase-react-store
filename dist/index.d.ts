import firebase from 'firebase/compat/app';
import { FirebaseOptions } from 'firebase/app';
import React, { FunctionComponent, ComponentClass } from 'react';

declare type DatabaseReference = firebase.database.Reference;
declare type DataSnapshot = firebase.database.DataSnapshot;
declare class Document {
    _ref: DatabaseReference;
    _valuePromise: Promise<any>;
    _resolveValues: (value?: unknown) => void;
    _rejectValues: (error: unknown) => void;
    _listeners: Set<any>;
    _value: any;
    constructor(reference: RTDatabase | DatabaseReference, path?: string);
    _onValueHandler: (response: DataSnapshot) => void;
    _onErrorHandler: (error: unknown) => void;
    get key(): string | null;
    get value(): any;
    get path(): string;
    onValues: () => Promise<unknown>;
    /**
     * Set a value, replacing whatever value is already present.
     *
     * To update specific fields use `update`.
     *
     * @param values:Object of properties to set
     * @returns Promise
     */
    set: (values: unknown) => Promise<void>;
    /**
     * Push a new child value without conflicts
     *
     * @param obj
     * @returns Promise
     */
    push: (obj: unknown) => Promise<Document>;
    /**
     * Update specific fields
     *
     * @param values:Object of properties to set
     * @returns Promise
     */
    update: (values: object) => Promise<void>;
    /**
     * Remove the path referred to by this document. This will also remove
     * any child nodes of the current path.
     *
     * @returns Promise
     */
    remove: () => Promise<void>;
    onDisconnect: () => firebase.database.OnDisconnect;
    close: () => void;
}

declare type Args$1 = {
    config: FirebaseOptions;
    persistence?: firebase.auth.Auth.Persistence;
};
declare class RTDatabase {
    TIMESTAMP: Object;
    fdb: firebase.database.Database;
    authPersistence: string;
    constructor({ persistence, ...config }: Args$1);
    get: (path: string) => Document;
    signInWithCustomToken: (token: string) => Promise<firebase.auth.UserCredential>;
    goOffline: () => any;
    goOnline: () => any;
    static signOut(): Promise<void>;
}

/**
 * `view` will execute the function immediately and will
 * track data accesses made through `ref` and re-execute the function
 * when a tracked database value changes.
 *
 * @param func
 */
declare function view(func: () => void): () => void;

/**
 * Decorate a whole class as an observer of one or more documents
 * @param Class
 */
declare function observer(Class: FunctionComponent | ComponentClass): any;

declare type Args = {
    database?: RTDatabase;
    path?: string;
    orderByKey?: boolean;
    orderByValue?: boolean;
    orderByChild?: string;
    limitToLast?: number;
    limitToFirst?: number;
};
declare type PropTypes = Args;
/**
 * This function/decorator creates a HOC that wraps the given
 * component and listens to collection events.
 *
 * Props passed to the wrapped component will include
 *
 * @param options
 */
declare const collectionObserver: (options?: Args) => (component: React.FunctionComponent<PropTypes>) => any;

export { RTDatabase, collectionObserver, observer, view };
