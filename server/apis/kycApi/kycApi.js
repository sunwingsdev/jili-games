const express = require("express");
const { ObjectId } = require("mongodb");

const kycApi = (kycCollection, homeControlsCollection) => {
  const router = express.Router();

  // add a kyc
  router.post("/", async (req, res) => {
    const kycInfo = req.body;
    kycInfo.status = "pending";
    kycInfo.createdAt = new Date();
    const result = await kycCollection.insertOne(kycInfo);
    res.send(result);
  });

  // get all kycs
  router.get("/", async (req, res) => {
    try {
      const result = await kycCollection
        .aggregate([
          {
            $addFields: {
              userId: { $toObjectId: "$userId" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userInfo",
            },
          },
          {
            $unwind: {
              path: "$userInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "userInfo.password": 0,
            },
          },
        ])
        .toArray();

      res.send(result);
    } catch (error) {
      console.error("Error fetching kycs:", error);
      res.status(500).send({ error: "Failed to fetch kycs" });
    }
  });

  // get a kyc by ID
  router.get("/single-kyc/:id", async (req, res) => {
    const { id } = req?.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!id) {
      return;
    }
    const result = await kycCollection.findOne(
      { userId: id },
      { projection: { password: 0 } }
    );
    res.send(result);
  });

  // update kyc status
  router.patch("/update-kyc-status/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const { status } = req.body;
    // Validate input
    if (!id || !status) {
      return res.status(400).json({ error: "Kyc ID and status are required" });
    }

    try {
      // Define valid statuses
      const validStatuses = ["approve", "reject", "pending"];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          error: "Invalid status. Use 'approve', 'reject', or 'pending'.",
        });
      }

      // Update the KYC status in the database
      const result = await kycCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
      );

      // Handle cases where no record is matched
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Kyc not found" });
      }

      // Return success response
      res.status(200).json({ message: "Kyc status updated successfully" });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: "Failed to update kyc status" });
    }
  });

  return router;
};
module.exports = kycApi;
