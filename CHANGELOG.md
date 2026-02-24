# Changelog

## 0.4.0

### Breaking Changes

- **Firebase v12 modular API migration**: Replaced all `firebase/compat/*` imports with modular equivalents from `firebase/app`, `firebase/database`, and `firebase/auth`
- `signOut` is now an instance method instead of a static method (requires an `Auth` instance)
- `peerDependencies.firebase` updated from `^9.8.3` to `^12.0.0`

### Fixed

- `collectionObserver`: `limitToFirst` constraint now correctly references `props.limitToFirst` instead of an undefined local variable

### Changed

- TypeScript compilation target updated from ES2015 to ES2020
- CI workflows updated to Node.js 20 and actions v4
- Removed `firebase-init.ts` compat singleton wrapper
