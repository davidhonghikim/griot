const neo4j = require('neo4j-driver');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'kos_knowledge';
const COLLECTION_NAME = 'markdown_docs';

const NEO4J_URI = 'bolt://localhost:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'your_password_here';

async function buildMarkdownGraph() {
  const mongoClient = new MongoClient(MONGO_URI);
  const neoDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
  const neoSession = neoDriver.session();

  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const docs = await collection.find().toArray();

    for (const doc of docs) {
      await neoSession.run(
        `MERGE (d:Document {doc_id: $docId})
         SET d.title = $title, d.file_path = $filePath`,
        {
          docId: doc._id.toString(),
          title: doc.title,
          filePath: doc.file_path
        }
      );
    }

    // Example: Link documents with similar tags
    for (const doc of docs) {
      if (doc.tags && doc.tags.length > 0) {
        for (const tag of doc.tags) {
          await neoSession.run(
            `MERGE (t:Tag {name: $tag})
             MERGE (d:Document {doc_id: $docId})
             MERGE (d)-[:TAGGED_WITH]->(t)`,
            {
              docId: doc._id.toString(),
              tag: tag
            }
          );
        }
      }
    }

    console.log('Markdown documents and tag links added to Neo4j graph.');
  } catch (err) {
    console.error('Error building Neo4j graph:', err);
  } finally {
    await mongoClient.close();
    await neoSession.close();
    await neoDriver.close();
  }
}

if (require.main === module) {
  buildMarkdownGraph();
}

module.exports = { buildMarkdownGraph };
