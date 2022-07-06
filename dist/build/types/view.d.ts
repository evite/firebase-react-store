export declare function dispose(func: () => void): void;
/**
 * `view` will execute the function immediately and will
 * track data accesses made through `ref` and re-execute the function
 * when a tracked database value changes.
 *
 * @param func
 */
export declare function view(func: () => void): () => void;
