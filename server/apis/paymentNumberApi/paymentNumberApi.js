const express = require("express");
const { ObjectId } = require("mongodb");

const paymentNumberApi = (paymentNumberCollection) => {
  const router = express.Router();

  // add a payment number
  router.post("/", async (req, res) => {
    const paymentNumberInfo = req.body;
    paymentNumberInfo.status = paymentNumberInfo.status || "pending";
    paymentNumberInfo.createdAt = new Date();
    const result = await paymentNumberCollection.insertOne(paymentNumberInfo);
    res.send(result);
  });

  // get all payment numbers
  router.get("/", async (req, res) => {
    try {
      const result = await paymentNumberCollection
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

  // get a payment number by ID
  router.get("/single-number/:id", async (req, res) => {
    const { id } = req?.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!id) {
      return;
    }
    const result = await paymentNumberCollection.findOne(
      { userId: id },
      { projection: { password: 0 } }
    );
    res.send(result);
  });

  // update payment number status
  router.patch("/update-number-status/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const { status } = req.body;
    // Validate input
    if (!id || !status) {
      return res
        .status(400)
        .json({ error: "Payment Number ID and status are required" });
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
      const result = await paymentNumberCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
      );

      // Handle cases where no record is matched
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Payment number not found" });
      }

      // Return success response
      res
        .status(200)
        .json({ message: "Payment number status updated successfully" });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: "Failed to update payment number status" });
    }
  });
  router.get("/random-number/:method", async (req, res) => {
    const { method } = req.params;

    try {
      const result = await paymentNumberCollection
        .aggregate([
          { $match: { status: "approve", paymentNumberMethod: method } },
          { $sample: { size: 1 } },
        ])
        .toArray();

      if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "No approved payment numbers found for this method" });
      }

      res.json(result[0]);
    } catch (error) {
      console.error("Error fetching random approved payment number:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch a random approved payment number" });
    }
  });

  return router;
};

module.exports = paymentNumberApi;
