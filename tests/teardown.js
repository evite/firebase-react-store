async function teardown() {
  global.__firebaseServer && (await global.__firebaseServer.close());
}

module.exports = teardown;
