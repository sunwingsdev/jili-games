const express = require("express");
const { ObjectId } = require("mongodb");

const subCategoryApi = (subCategoryCollection, homeGamesCollection) => {
  const router = express.Router();

  // Add a sub category
  router.post("/", async (req, res) => {
    const subCategoryInfo = req.body;
    subCategoryInfo.createdAt = new Date();
    const result = await subCategoryCollection.insertOne(subCategoryInfo);
    res.send(result);
  });

  // Get all sub categories data
  router.get("/", async (req, res) => {
    const result = await subCategoryCollection.find().toArray();
    res.send(result);
  });

  // Update a sub-category
  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updatedInfo = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        ...updatedInfo,
        updatedAt: new Date(),
      },
    };

    const result = await subCategoryCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

  // Delete a sub-category and its related games
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Step 1: Find the sub-category by ID
      const subCategory = await subCategoryCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!subCategory) {
        return res.status(404).send({ error: "Sub-category not found." });
      }

      const subCategoryName = subCategory.name;

      // Step 2: Delete all games under this sub-category
      const gameDeleteResult = await homeGamesCollection.deleteMany({
        subCategory: subCategoryName,
      });

      // Step 3: Delete the sub-category
      const subCategoryDeleteResult = await subCategoryCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        message: "Sub-category and related games deleted successfully.",
        deletedSubCategory: subCategoryDeleteResult,
        deletedGames: gameDeleteResult.deletedCount,
      });
    } catch (error) {
      console.error("Delete Error:", error);
      res
        .status(500)
        .send({ error: "Failed to delete sub-category and games." });
    }
  });

  return router;
};

module.exports = subCategoryApi;
