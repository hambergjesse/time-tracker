require("dotenv").config();
const mongo = require("mongodb").MongoClient;
const path = require("path");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

// MongoDB variables
let db, collection;

// connect to MongoDB database
mongo.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    // set database and collection
    db = client.db("timetracker");
    collection = db.collection("accountdata");
  }
);

// create API for front end fetch of user data
app.get("/users", (req, res) => {
  collection.find().toArray((err, users) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json(users);
  });
});

// login password verification
app.post("/users/login", async (req, res) => {
  try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    console.log(hashedPassword);
    collection.findOneAndUpdate(
      { name: user.name },
      { $set: { password: hashedPassword } }
    );
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

// check if username and password are both valid
app.post("/users/login/auth", async (req, res) => {
  const users = await collection.find().toArray();
  const user = await users.find((user) => user.name === req.body.name);
  if (user === null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json("Success");
      console.log("Success");
    } else {
      res.status(404).json("Not Allowed");
      console.log("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

// update last login and login history
app.post("/clockin", (req, res) => {
  const user = req.body;
  console.log(user);

  collection.findOneAndUpdate(
    { name: user.name },
    { $set: { lastlogin: user.lastlogin } }
  );

  collection.updateOne(
    { name: user.name },
    { $push: { pastlogins: { $each: [user.lastlogin], $position: 0 } } }
  );
  console.log("clock-in updated");
});

// update last login and login history
app.post("/clockin", (req, res) => {
  const user = req.body;
  console.log(user);

  collection.findOneAndUpdate(
    { name: user.name },
    { $set: { lastlogin: user.lastlogin } }
  );

  collection.updateOne(
    { name: user.name },
    { $push: { pastlogins: { $each: [user.lastlogin], $position: 0 } } }
  );
  console.log("clock-in updated");
});

// update last login and login history
app.post("/clockout", (req, res) => {
  const user = req.body;
  console.log(user);

  collection.updateOne(
    { name: user.name },
    { $push: { pastlogouts: { $each: [user.lastlogin], $position: 0 } } }
  );
  console.log("clock-out updated");
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// server process
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});
