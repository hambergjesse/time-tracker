require("dotenv").config();
const mongo = require("mongodb").MongoClient;
const express = require("express");
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");

// connect to mongodb
let db, collection;

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
    db = client.db("timetracker");
    collection = db.collection("accountdata");
  }
);

// create API for front end fetch
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

app.post("/user", (req, res) => {
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
});

app.post("/login", (req, res) => {
  //auth user
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});
