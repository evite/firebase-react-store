const FirebaseServer = require('firebase-server');

async function setup() {
  console.log('firebase starting...');
  global.__firebaseServer = new FirebaseServer(5555, 'localhost', {});
}

module.exports = setup;
