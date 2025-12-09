
require('dotenv').config({ path: '.env' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if the environment variable is set
if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('FIREBASE_ADMIN_PRIVATE_KEY is not set in .env file.');
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)),
    projectId: 'culture-rally',
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  if (error.code === 'app/duplicate-app') {
      console.log('Firebase app already initialized.');
  } else {
      process.exit(1);
  }
}


const db = admin.firestore();

// Function to read JSON file and seed a collection
const seedCollection = async (fileName, collectionName) => {
  const filePath = path.join(__dirname, '..', 'firestore', fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }
    
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Each document is on a new line
  const documents = fileContent.trim().split('\n');

  if (documents.length === 0 || (documents.length === 1 && documents[0] === '')) {
    console.log(`No documents to seed for ${collectionName}.`);
    return;
  }

  const batch = db.batch();

  for (const docString of documents) {
    try {
      const docData = JSON.parse(docString);
      // Use the 'id' field from the JSON as the document ID in Firestore
      const docId = docData.id; 
      if (!docId) {
        console.warn(`Skipping document in ${fileName} because it is missing an 'id' field:`, docData);
        continue;
      }
      const docRef = db.collection(collectionName).doc(String(docId));
      batch.set(docRef, docData);
    } catch (e) {
      console.error(`Error parsing JSON from ${fileName}:`, docString, e);
    }
  }

  try {
    await batch.commit();
    console.log(`Successfully seeded ${collectionName} with ${documents.length} documents.`);
  } catch (error) {
    console.error(`Error committing batch for ${collectionName}:`, error);
  }
};

const main = async () => {
  console.log('Starting Firestore seeding...');
  await seedCollection('horses.json', 'horses');
  await seedCollection('instructors.json', 'instructors');
  // Add other collections here if needed
  console.log('Firestore seeding complete.');
};

main().catch(console.error);
