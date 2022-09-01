const mongo = require("mongodb").MongoClient;
const express = require("express");
const app = express();

const uri =
  "mongodb+srv://hambergjesse:123@cluster0.osqpkfc.mongodb.net/test?retryWrites=true&w=majority";

// connect to  mongodb
let db, accountdata;

mongo.connect(
  uri,
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
    accountdata = db.collection("accountdata");
  }
);

app.get("/users", (req, res) => {
  accountdata.find().toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json(items);
    console.log(items);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});
