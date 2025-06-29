const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'kos_knowledge';
const COLLECTION_NAME = 'markdown_docs';
const WEAVIATE_URL = 'http://localhost:8080';

async function chunkAndVectorize() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const docs = await collection.find().toArray();

    for (const doc of docs) {
      const chunks = chunkMarkdown(doc.markdown_content);
      for (let i = 0; i < chunks.length; i++) {
        const vector = await generateEmbedding(chunks[i]);
        const weaviateObject = {
          class: 'MarkdownChunk',
          id: `${doc._id}_${i}`,
          properties: {
            doc_id: doc._id.toString(),
            chunk_index: i,
            content: chunks[i],
            file_path: doc.file_path,
            title: doc.title
          },
          vector: vector
        };
        await insertIntoWeaviate(weaviateObject);
        console.log(`Indexed chunk ${i} from doc ${doc.title}`);
      }
    }
  } catch (err) {
    console.error('Error during chunking and vectorization:', err);
  } finally {
    await client.close();
  }
}

function chunkMarkdown(text, maxTokens = 500) {
  const lines = text.split('\n');
  let chunks = [];
  let currentChunk = '';
  for (const line of lines) {
    if ((currentChunk + line).length > maxTokens * 5) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    currentChunk += line + '\n';
  }
  if (currentChunk.trim()) chunks.push(currentChunk);
  return chunks;
}

async function generateEmbedding(text) {
  try {
    const response = await axios.post(`${WEAVIATE_URL}/v1/embeddings`, {
      text: text
    });
    return response.data.vector;
  } catch (error) {
    console.error('Embedding error:', error.response ? error.response.data : error);
    return [];
  }
}

async function insertIntoWeaviate(obj) {
  try {
    await axios.post(`${WEAVIATE_URL}/v1/objects`, obj);
  } catch (error) {
    console.error('Weaviate insert error:', error.response ? error.response.data : error);
  }
}

if (require.main === module) {
  chunkAndVectorize();
}

module.exports = { chunkAndVectorize };
