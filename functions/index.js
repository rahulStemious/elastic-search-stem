const functions = require('firebase-functions');
const { handleFirestoreChange } = require('./src/handler');

const collectionPath = process.env.FIRESTORE_COLLECTION_PATH;
const indexName = process.env.ELASTIC_INDEX;

if (!collectionPath || !indexName) {
  throw new Error("❌ FIRESTORE_COLLECTION_PATH and ELASTIC_INDEX are required parameters.");
}

// Function name will be unique per collection to avoid overwrite
const functionName = `sync_${collectionPath.replace(/\//g, '_')}_to_elasticsearch`;

exports.sync_firestore_to_elasticsearch = functions.firestore
  .document(`${collectionPath}/{docId}`)
  .onWrite((change, context) => {
    
    const collectionPath = process.env.FIRESTORE_COLLECTION_PATH;
    const indexName = process.env.ELASTIC_INDEX;
   if (!collectionPath || !indexName) {
      console.error("❌ FIRESTORE_COLLECTION_PATH or ELASTIC_INDEX missing at runtime.");
      return null;
    }
    const dataObj = {
      collectionId:collectionPath,
      docId:context.params.docId
    }

    // Optional: sanity check — ensure it matches the configured collection
    if (!context.resource.name.includes(collectionPath)) {
      console.log(`Skipping event for unrelated path: ${context.resource.name}`);
      return null;
    }

    console.log(`✅ Triggered for collection: ${collectionPath}, index: ${indexName}`);
    return handleFirestoreChange(change, dataObj, indexName);
  });
