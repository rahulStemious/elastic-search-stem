const functions = require('firebase-functions');
const { handleFirestoreChange } = require('./src/handler');

const collectionPath = process.env.FIRESTORE_COLLECTION_PATH;
const indexName = process.env.ELASTIC_INDEX;

if (!collectionPath || !indexName) {
  throw new Error("❌ FIRESTORE_COLLECTION_PATH and ELASTIC_INDEX are required parameters.");
}

// Function name will be unique per collection to avoid overwrite
const functionName = `sync_${collectionPath.replace(/\//g, '_')}_to_elasticsearch`;

exports[functionName] = functions.firestore
  .document(`${collectionPath}/{docId}`)
  .onWrite((change, context) => handleFirestoreChange(change, context, indexName));
