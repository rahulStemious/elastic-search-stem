const { mapAllowedKeys } = require('./utils');
const { toSnakeCase } = require('./snakeCaseConverter');

if (typeof File === "undefined") {
  global.File = class File extends Blob {
    constructor(chunks, name, options = {}) {
      super(chunks, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
 node: process.env.ELASTIC_URL,
auth: {
  apiKey: process.env.ELASTIC_API_KEY
}
});

exports.handleFirestoreChange = async (change, context, indexName) => {
  const { collectionId, docId } = context;
  console.log(`=> `,JSON.parse(JSON.stringify(context)));
  try {
    // DELETE
    if (!change.after.exists) {
      await client.delete({ index: indexName, id: docId }).catch(err => {
        if (err.meta?.statusCode !== 404) console.error(`Delete failed:`, err);
      });
      console.log(`🗑️ Deleted doc ${docId} from index ${indexName}`);
      return;
    }

    // CREATE / UPDATE
    const newData = change.after.data();

    // Filter & map allowed fields
    const mappedData = mapAllowedKeys(newData);

    // Convert final object to snake_case
    const snakeData = toSnakeCase(mappedData);

    await client.index({
      index: indexName,
      id: docId,
      document: snakeData,
    });

    console.log(`✅ Synced doc ${docId} to index ${indexName}`);
  } catch (error) {
    console.error(`❌ Error syncing ${collectionId}/${docId}:`, error);
  }
};
