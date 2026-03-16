import 'dotenv/config';
import { MongoClient } from 'mongodb';

// መረጃው በትክክል መምጣቱን ለማረጋገጥ ይሄንን መስመር ይጨምሩ
console.log("MONGO_URI value is:", process.env.MONGO_URI);

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    
    // 1. ዳታቤዝ መፍጠር (aviationDB የሚባል ባይኖር በራሱ ጊዜ ይፈጠራል)
    const database = client.db("aviationDB"); 
    
    // 2. ኮሌክሽን መፍጠር (gallery የሚባል ባይኖር በራሱ ጊዜ ይፈጠራል)
    const collection = database.collection("gallery");

    // 3. መረጃ ማስገባት (መረጃ ሲገባ ነው ዳታቤዙ እና ኮሌክሽኑ በአትላስ ላይ የሚታዩት)
    const doc = { name: "የአውሮፕላን ፎቶ", type: "Boeing 737", date: new Date() };
    const result = await collection.insertOne(doc);

    console.log(`ዳታቤዝ እና ኮሌክሽን ተፈጥረዋል! መረጃው የተላከበት ID: ${result.insertedId}`);
    
  } catch (err) {
    console.error("ስህተት:", err);
  } finally {
    await client.close();
  }
}
run();