const express = require("express");
const { ObjectId } = require("mongodb");

const promotionCategoryApi = (promotionCategoryCollection) => {
  const router = express.Router();

  // Add a promotion category
  router.post("/", async (req, res) => {
    const categoryInfo = req.body;
    categoryInfo.createdAt = new Date();
    try {
      const result = await promotionCategoryCollection.insertOne(categoryInfo);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to add promotion category." });
    }
  });

  // Get all promotion categories
  router.get("/", async (req, res) => {
    try {
      const result = await promotionCategoryCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch promotion categories." });
    }
  });

  // Update a promotion category
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const result = await promotionCategoryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update promotion category." });
    }
  });

  // Delete a promotion category
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await promotionCategoryCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete promotion category." });
    }
  });

  return router;
};

module.exports = promotionCategoryApi;
