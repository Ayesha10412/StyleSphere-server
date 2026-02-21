const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.mongoDB_UserName}:${process.env.mongoDB_Pass}@cluster0.i7pwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db("ShopDB").collection("users");
    const sellerCollection = client.db("ShopDB").collection("sellers");
    const productCollection = client.db("ShopDB").collection("products");
    const orderCollection = client.db("ShopDB").collection("orders");
    const reviewCollection = client.db("ShopDB").collection("reviews");
    //jwt token
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "365d",
      });
      console.log(token);
      // console.log(token);
      res.send({ token });
    });
    //middleware
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Unauthorized access!" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_TOKEN, (error, decoded) => {
        if (error) {
          return res.status(401).send({ message: "Unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };
    //verify Admin
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden access!" });
      }
      next();
    };
    //verify seller
    const verifySeller = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const seller = await sellerCollection.findOne(query);
      if (!seller || seller?.role !== "seller") {
        return res.status(403).send({ message: "Forbidden access!" });
      }
      next();
    };
    //create user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists!" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //get all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    //update user
    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollection.updateOne(query, updateDoc);
        res.send(result);
      },
    );
    //delete a user
    app.delete("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //get admin
    app.get("/user/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Forbidden access!" });
      }
      const query = { email: email };
      const result = await userCollection.findOne(query);
      let admin = false;
      if (result) {
        admin = result?.role === "admin";
      }
      // console.log(admin);
      res.send({ admin });
    });

    //update information for admin and user
    app.patch("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const { name, photo } = req.body;
      try {
        const user = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { name, photo } },
        );
        if (user.matchedCount === 0) {
          return res.status(404).json({ message: "User not found!" });
        }
        if (user.modifiedCount === 0) {
          return res
            .status(200)
            .json({ modifiedCount: 0, message: "No changes detected!" });
        }
        const updatedUser = await userCollection.findOne({
          _id: new ObjectId(id),
        });
        res.status(200).json({
          modifiedCount: 1,
          message: "Profile Updated Successfully!",
          updatedUser,
        });
      } catch (error) {
        return res.status(500).json({ message: "Server error!" });
      }
    });

    //create seller
    app.post("/sellers", async (req, res) => {
      const seller = req.body;
      const result = await sellerCollection.insertOne(seller);
      res.send(result);
    });
    //get sellers
    app.get("/sellers", async (req, res) => {
      const sellers = await sellerCollection.find().toArray();
      res.send(sellers);
    });
    //get seller by email
    app.get("/seller/profile/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const seller = await sellerCollection.findOne({ email });
      res.send(seller);
    });
    //make seller
    app.patch("/seller/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "seller",
        },
      };
      const seller = await sellerCollection.updateOne(query, updatedDoc);
      res.send(seller);
    });
    //update own information
    app.patch("/seller/profile/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const { name, photo, phone, address } = req.body;
      try {
        const seller = await sellerCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { name, photo, address, phone } },
        );

        if (seller.matchedCount === 0) {
          return res.status(404).json({ message: "Seller not found!" });
        }
        if (seller.modifiedCount === 0) {
          return res
            .status(200)
            .json({ modifiedCount, message: "No changes detected!" });
        }
        const updatedSeller = await sellerCollection.findOne({
          _id: new ObjectId(id),
        });
        return res.status(200).json({
          modifiedCount: 1,
          message: "Profile updated successfully!",
          updatedSeller,
        });
      } catch (error) {
        return res.status(500).json({ message: "Server error!" });
      }
    });
    //delete seller
    app.delete("/seller/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sellerCollection.deleteOne(query);
      res.send(result);
    });

    //add products
    app.post("/products", verifyToken, async (req, res) => {
      const { role } = req.decoded;
      if (role !== "seller") {
        return res
          .status(403)
          .send({ message: "Seller only can add the products!" });
      }
      const product = req.body;
      product.status = "pending"; //admin approval
      product.createAt = new Date();
      const result = await productCollection.insertOne(product);
      return res.status(201).send({
        message: "Product added successfully! Waiting for admin approval.",
        result,
      });
    });

    //get all products
    app.get("/products", verifyToken, async (req, res) => {
      const products = await productCollection.find().toArray();
      return res.send(products);
    });
    //get products by id
    app.get("/product/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!product) {
        return res.status(404).send({ message: "Product not found!" });
      }
      res.send(product);
    });
    //update product by id
    app.patch("/product/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      if (
        req.decoded.email !== product.seller ||
        Emailreq.decoded.role !== "admin"
      ) {
        return res.status(403).send({ message: "Forbidden access!" });
      }
      const updatedDoc = { $set: req.body };
      const result = await productCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedDoc,
      );
      return res
        .status(201)
        .send({ message: "Product updated successfully!", result });
    });

    //delete product by id
    app.delete("/product/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!product) {
        return res.status(404).send({ message: "Product not found!" });
      }
      if (
        res.decoded.email !== product.sellerEmail ||
        req.decoded.role !== "admin"
      ) {
        return res.status(403).send({ message: "Forbidden access!" });
      }
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      return res.status(200).send({ message: "Product deleted successfully!", result });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Shop management server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
