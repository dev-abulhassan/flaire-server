const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqk9iwm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("flaire").collection("user");
    const allClassCollection = client.db("flaire").collection("addClass");
    const selectedClassCollection = client
      .db("flaire")
      .collection("selectedClass");

    const classCollection = client.db("flaire").collection("class");
    const studentCollection = client.db("flaire").collection("student");
    const instructorCollection = client.db("flaire").collection("instructor");
    const adminCollection = client.db("flaire").collection("admin");

    app.get("/class", async (req, res) => {
      const filter = {};
      const result = await allClassCollection.find(filter).toArray();
      res.send(result);
    });

    app.post("/create_user", async (req, res) => {
      const userInfo = req.body;
      const filter = {
        email: userInfo.email,
      };
      const alreadyUser = await userCollection.find(filter).toArray();
      if (alreadyUser.length) {
        const message = `Already have a user this ${userInfo.email}`;
        return res.send({ acknowledged: false, message });
      }
      const user = await userCollection.insertOne(userInfo);
      res.send(user);
    });
    //get all user
    app.get("/user", async (req, res) => {
      const filter = {};
      const result = await userCollection.find(filter).toArray();
      res.send(result);
    });

    console.log("Database is connected Successfull");
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Flaire is Dancing");
});

app.listen(port, () => {
  console.log(`Flaire Server is running on port ${port}`);
});
