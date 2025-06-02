const express = require("express");
const { ObjectId } = require("mongodb");

const commissionApi = (commissionsCollection) => {
  const router = express.Router();

  //   add a commission
  router.post("/", async (req, res) => {
    const commissionInfo = req.body;
    commissionInfo.status = "pending";
    commissionInfo.createdAt = new Date();
    const result = await commissionsCollection.insertOne(commissionInfo);
    res.send(result);
  });

  // Update a commission
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid commission ID" });
      }

      const updatedData = req.body;
      updatedData.updatedAt = new Date(); // Track updates

      const result = await commissionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Commission not found" });
      }

      res.send({ message: "Commission updated successfully", result });
    } catch (error) {
      res.status(500).send({ message: "Failed to update commission", error });
    }
  });

  // Get all commissions
  router.get("/", async (req, res) => {
    try {
      const commissions = await commissionsCollection.find().toArray();
      res.send(commissions);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch commissions", error });
    }
  });

  return router;
};
module.exports = commissionApi;
