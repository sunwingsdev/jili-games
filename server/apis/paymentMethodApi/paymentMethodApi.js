const express = require("express");
const { ObjectId } = require("mongodb");
const paymentMethodApi = (paymentMethodCollection) => {
  const router = express.Router();

  // Add a payment method data
  router.post("/", async (req, res) => {
    const paymentMethodInfo = req.body;
    paymentMethodInfo.createdAt = new Date();
    paymentMethodInfo.status = "inactive";
    const result = await paymentMethodCollection.insertOne(paymentMethodInfo);
    res.send(result);
  });

  // Get all payment method data
  router.get("/", async (req, res) => {
    const result = await paymentMethodCollection.find().toArray();
    res.send(result);
  });

  // Get a payment method by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }

    try {
      const paymentMethod = await paymentMethodCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!paymentMethod) {
        return res.status(404).send({ error: "Payment method not found" });
      }

      res.send(paymentMethod);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // update a payment method
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }

    try {
      const selectedObject = await paymentMethodCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!selectedObject) {
        return res.status(404).send({ error: "Object not found" });
      }

      const updatedDoc = { $set: { ...req.body } };
      const result = await paymentMethodCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedDoc
      );
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // delete a payment method
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ObjectId format" });
    }
    const selectedObject = await paymentMethodCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!selectedObject) {
      return res.status(404).send({ error: "Object not found" });
    }
    const result = await paymentMethodCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  });

  return router;
};

module.exports = paymentMethodApi;
