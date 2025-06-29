const neo4j = require('neo4j-driver');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'kos_knowledge';
const COLLECTION_NAME = 'markdown_docs';

const NEO4J_URI = 'bolt://localhost:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'your_password_here';

async function linkDocumentsByReference() {
  const mongoClient = new MongoClient(MONGO_URI);
  const neoDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
  const neoSession = neoDriver.session();

  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const docs = await collection.find().toArray();

    const docTitles = new Set(docs.map(d => d.title));

    for (const doc of docs) {
      for (const targetTitle of docTitles) {
        if (targetTitle !== doc.title && doc.markdown_content.includes(targetTitle)) {
          await neoSession.run(
            `MATCH (src:Document {doc_id: $srcId}), (tgt:Document {title: $targetTitle})
             MERGE (src)-[:REFERENCES]->(tgt)`,
            {
              srcId: doc._id.toString(),
              targetTitle: targetTitle
            }
          );
          console.log(`Linked: ${doc.title} -> ${targetTitle}`);
        }
      }
    }
    console.log('Document-to-document reference linking complete.');
  } catch (err) {
    console.error('Error creating doc-to-doc links:', err);
  } finally {
    await mongoClient.close();
    await neoSession.close();
    await neoDriver.close();
  }
}

if (require.main === module) {
  linkDocumentsByReference();
}

module.exports = { linkDocumentsByReference };
