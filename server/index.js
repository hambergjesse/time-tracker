const { MongoClient } = require("mongodb");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// connect to  mongodb
async function main() {
  const uri =
    "mongodb+srv://hambergjesse:123@cluster0.osqpkfc.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

// fetch databases from mongodb
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

main().catch(console.error);

//

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
