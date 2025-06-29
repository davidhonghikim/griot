// MongoDB initialization script for PersonaRAG Bridge
// This script sets up the database with necessary collections and indexes

// Switch to the griot database
db = db.getSiblingDB('griot');

// Create collections
db.createCollection('personas');
db.createCollection('persona_documents');
db.createCollection('conversations');
db.createCollection('messages');
db.createCollection('embeddings');

// Create indexes for better performance
db.personas.createIndex({ "name": 1 });
db.personas.createIndex({ "tags": 1 });
db.personas.createIndex({ "metadata.base": 1 });
db.personas.createIndex({ "createdAt": -1 });

db.persona_documents.createIndex({ "personaId": 1 });
db.persona_documents.createIndex({ "tags": 1 });
db.persona_documents.createIndex({ "createdAt": -1 });
db.persona_documents.createIndex({ "content": "text" });

db.conversations.createIndex({ "userId": 1 });
db.conversations.createIndex({ "personaId": 1 });
db.conversations.createIndex({ "createdAt": -1 });

db.messages.createIndex({ "conversationId": 1 });
db.messages.createIndex({ "role": 1 });
db.messages.createIndex({ "createdAt": -1 });

db.embeddings.createIndex({ "documentId": 1 });
db.embeddings.createIndex({ "personaId": 1 });

// Insert sample personas
db.personas.insertMany([
  {
    _id: "griot_001",
    name: "Griot",
    description: "Traditional West African storyteller and cultural preservationist",
    content: "I am a Griot, a traditional West African storyteller, musician, and oral historian. I preserve cultural knowledge through narrative and song, passing down wisdom from generation to generation. My role is to maintain the collective memory of our people and share stories that teach, inspire, and connect us to our roots.",
    metadata: {
      base: "griot",
      variant: "traditional",
      author: "system",
      description: "Traditional West African storyteller and cultural preservationist"
    },
    tags: ["storytelling", "culture", "music", "history", "wisdom", "tradition"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "tohunga_001",
    name: "Tohunga",
    description: "Māori spiritual guide and keeper of traditional knowledge",
    content: "I am a Tohunga, a Māori priest and expert in traditional knowledge. I serve as a spiritual guide and keeper of cultural wisdom, helping others understand the sacred connections between people, land, and ancestors. My knowledge encompasses healing, spiritual practices, and the preservation of cultural traditions.",
    metadata: {
      base: "tohunga",
      variant: "traditional",
      author: "system",
      description: "Māori spiritual guide and keeper of traditional knowledge"
    },
    tags: ["spirituality", "culture", "wisdom", "guidance", "healing", "tradition"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create a user for the application
db.createUser({
  user: "griot_user",
  pwd: "your-secure-password",
  roles: [
    { role: "readWrite", db: "griot" }
  ]
});

print("✅ MongoDB initialization completed successfully!"); 