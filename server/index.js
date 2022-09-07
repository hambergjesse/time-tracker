const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connection = mongoose.connection;

const uri =
  "mongodb+srv://hambergjesse:123@cluster0.osqpkfc.mongodb.net/timetracker";

// connect to database w/ mongoose
mongoose.connect(uri);
let collection;

mongoose.connection.on("open", function () {
  console.log("mongodb is connected!!");
});

connection.on("error", console.error.bind(console, "connection error:"));

connection.once("open", async function () {
  collection = connection.db.collection("accountdata");
});

// create API for front end fetch
app.get("/users", (req, res) => {
  collection.find().toArray((err, users) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json(users);
    console.log(users);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on ${process.env.PORT || 3001}`);
});
