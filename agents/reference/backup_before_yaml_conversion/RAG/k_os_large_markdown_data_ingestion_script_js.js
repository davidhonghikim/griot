const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'kos_knowledge';
const COLLECTION_NAME = 'markdown_docs';

async function ingestMarkdownDirectory(directoryPath) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const walkDir = (dir, filelist = []) => {
      fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          filelist = walkDir(filepath, filelist);
        } else if (file.endsWith('.md')) {
          filelist.push(filepath);
        }
      });
      return filelist;
    };

    const files = walkDir(directoryPath);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const stats = fs.statSync(file);
      const doc = {
        file_path: file,
        title: path.basename(file, '.md'),
        markdown_content: content,
        last_modified: stats.mtime,
        tags: [],  // Optional: Add your own tagging logic here
        created_at: new Date()
      };

      const result = await collection.updateOne(
        { file_path: file },
        { $set: doc },
        { upsert: true }
      );
      console.log(`Ingested: ${file} (Upserted=${result.upsertedCount > 0})`);
    }
  } catch (err) {
    console.error('Error during ingestion:', err);
  } finally {
    await client.close();
  }
}

// CLI Support
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: node ingest_md.js <directory_path>');
    process.exit(1);
  }
  ingestMarkdownDirectory(args[0]);
}

module.exports = { ingestMarkdownDirectory };
