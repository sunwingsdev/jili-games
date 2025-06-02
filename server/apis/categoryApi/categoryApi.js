const express = require("express");
const { ObjectId } = require("mongodb");

const categoryApi = (
  categoryCollection,
  subCategoryCollection,
  homeGamesCollection
) => {
  const router = express.Router();

  // Add a category
  router.post("/", async (req, res) => {
    const categoryInfo = req.body;
    categoryInfo.createdAt = new Date();
    const result = await categoryCollection.insertOne(categoryInfo);
    res.send(result);
  });

  // Get all categories data
  router.get("/", async (req, res) => {
    const result = await categoryCollection.find().toArray();
    res.send(result);
  });

  // Update a category by ID
  router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    try {
      const result = await categoryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update category." });
    }
  });

  // Delete a category by ID and its related games + subcategories
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Step 1: Find the category name using its ID
      const category = await categoryCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!category) {
        return res.status(404).send({ error: "Category not found." });
      }

      const categoryName = category.name;

      // Step 2: Delete all games under that category
      const gameDeleteResult = await homeGamesCollection.deleteMany({
        category: categoryName,
      });

      // Step 3: Delete all sub-categories under that category
      const subCategoryDeleteResult = await subCategoryCollection.deleteMany({
        category: categoryName,
      });

      // Step 4: Delete the category itself
      const categoryDeleteResult = await categoryCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        message:
          "Category, related games, and sub-categories deleted successfully.",
        deletedCategory: categoryDeleteResult,
        deletedGames: gameDeleteResult.deletedCount,
        deletedSubCategories: subCategoryDeleteResult.deletedCount,
      });
    } catch (error) {
      console.error("Delete Error:", error);
      res
        .status(500)
        .send({
          error: "Failed to delete category, games, and sub-categories.",
        });
    }
  });

  return router;
};

module.exports = categoryApi;
