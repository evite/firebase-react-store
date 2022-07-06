import React from 'react';
import { RTDatabase } from './database';
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
export declare const collectionObserver: (options?: Args) => (component: React.FunctionComponent<PropTypes>) => any;
export {};
