const express = require("express");
const { ObjectId } = require("mongodb");

const packagesApi = (packagesCollection) => {
  const router = express.Router();

  // Create a new package
  router.post("/", async (req, res) => {
    const packageData = req.body;
    packageData.createdAt = new Date();
    try {
      const result = await packagesCollection.insertOne(packageData);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to create package." });
    }
  });

  // Get all packages
  router.get("/", async (req, res) => {
    try {
      const result = await packagesCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch packages." });
    }
  });

  // Get a single package by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await packagesCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!result) {
        return res.status(404).send({ error: "Package not found." });
      }
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch the package." });
    }
  });

  // Update a package by ID
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { _id, ...updatedData } = req.body;

    try {
      const result = await packagesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).send({ error: "Failed to update package." });
    }
  });

  // Delete a package by ID
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await packagesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete package." });
    }
  });

  return router;
};

module.exports = packagesApi;
