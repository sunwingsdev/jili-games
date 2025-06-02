const express = require("express");
const { ObjectId } = require("mongodb");

const promotionApi = (promotionCollection) => {
  const router = express.Router();

  // Add a promotion data
  router.post("/", async (req, res) => {
    const promotionInfo = req.body;
    promotionInfo.createdAt = new Date();
    const result = await promotionCollection.insertOne(promotionInfo);
    res.send(result);
  });

  // Get all promotion data
  router.get("/", async (req, res) => {
    const result = await promotionCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  });
  // TODO promotion update not set yet
  // update a promotion
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;

    console.log(id);
  });

  // delete a promotion
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await promotionCollection.deleteOne(query);
    res.send(result);
  });

  return router;
};

module.exports = promotionApi;
