import type { DatabaseReference, DataSnapshot, OnDisconnect, Unsubscribe } from 'firebase/database';
import { RTDatabase } from './database';
export declare class Document {
    _ref: DatabaseReference;
    _valuePromise: Promise<any>;
    _resolveValues: (value?: unknown) => void;
    _rejectValues: (error: unknown) => void;
    _listeners: Set<any>;
    _value: any;
    _unsubscribe: Unsubscribe;
    constructor(reference: RTDatabase | DatabaseReference, path?: string);
    _onValueHandler: (response: DataSnapshot) => void;
    _onErrorHandler: (error: Error) => void;
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
    onDisconnect: () => OnDisconnect;
    close: () => void;
}
