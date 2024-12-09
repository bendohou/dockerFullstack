const express = require("express");
const { MongoClient } = require("mongodb");
let count = 0;
let clientDb;
const uri =
  process.env.NODE_ENV === "production"
    ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@db`
    : `mongodb://db`;

const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("CONNEXION DB OK !");
    clientDb = client;
    count = client.db("test").collection("count");
  } catch (err) {
    console.log(err.stack);
  }
}
run().catch(console.dir);

const app = express();

app.get("/api/count", (req, res) => {
  count
    .findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { returnNewDocument: true, upsert: true }
    )
    .then((doc) => {
      res.status(200).json(doc ? doc.count : 0);
    });
});

app.all("*", (req, res) => {
  res.status(404).end();
});

const server = app.listen(80);

process.addListener("SIGINT", () => {
  server.close((err) => {
    if (err) {
      process.exit(1);
    } else {
      if (clientDb) {
        clientDb.close((err) => process.exit(err ? 1 : 0));
      } else {
        process.exit(0);
      }
    }
  });
});
