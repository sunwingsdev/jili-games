const express = require("express");
const { ObjectId } = require("mongodb");

const withdrawMethodApi = (withdrawMethodCollection) => {
  const router = express.Router();

  // Add a withdraw method data
  router.post("/", async (req, res) => {
    const withdrawMethodInfo = req.body;
    withdrawMethodInfo.createdAt = new Date();
    withdrawMethodInfo.status = "inactive";
    const result = await withdrawMethodCollection.insertOne(withdrawMethodInfo);
    res.send(result);
  });

  // Get all withdraw method data
  router.get("/", async (req, res) => {
    const result = await withdrawMethodCollection.find().toArray();
    res.send(result);
  });

  // Get a withdraw method by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }

    try {
      const withdrawMethod = await withdrawMethodCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!withdrawMethod) {
        return res.status(404).send({ error: "withdraw method not found" });
      }

      res.send(withdrawMethod);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // update a withdraw method
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }

    try {
      const selectedObject = await withdrawMethodCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!selectedObject) {
        return res.status(404).send({ error: "Object not found" });
      }

      const updatedDoc = { $set: { ...req.body } };
      const result = await withdrawMethodCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedDoc
      );
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // delete a withdraw method
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }
    const selectedObject = await withdrawMethodCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!selectedObject) {
      return res.status(404).send({ error: "Object not found" });
    }
    const result = await withdrawMethodCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  });

  return router;
};

module.exports = withdrawMethodApi;
