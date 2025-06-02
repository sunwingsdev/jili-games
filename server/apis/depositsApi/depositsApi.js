const express = require("express");
const { ObjectId } = require("mongodb");

const depositsApi = (depositsCollection, usersCollection) => {
  const router = express.Router();

  // Add a deposit request
  router.post("/", async (req, res) => {
    const depositInfo = req.body;
    depositInfo.status = "pending";
    depositInfo.createdAt = new Date();
    const result = await depositsCollection.insertOne(depositInfo);
    res.send(result);
  });

  router.get("/", async (req, res) => {
    try {
      const result = await depositsCollection
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
      console.error("Error fetching deposits:", error);
      res.status(500).send({ error: "Failed to fetch deposits" });
    }
  });

  // Get all deposits for a specific user
  router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await depositsCollection
        .find({ userId: userId })
        .toArray();

      res.send(result);
    } catch (error) {
      console.error("Error fetching user deposits:", error);
      res.status(500).send({ error: "Failed to fetch user deposits" });
    }
  });

  router.patch("/status/:id", async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    try {
      const deposit = await depositsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!deposit) {
        return res.status(404).send({ error: "Deposit not found" });
      }

      if (deposit.status !== "pending") {
        return res
          .status(400)
          .send({ error: "Deposit is not in a pending state" });
      }

      const updateFields = { status };
      if (status === "rejected") {
        updateFields.reason = reason;
      }

      const updateResult = await depositsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      // Only increase balance if completed
      if (status === "completed") {
        await usersCollection.updateOne(
          { _id: new ObjectId(deposit.userId) },
          { $inc: { balance: deposit.amount, depositBalance: deposit.amount } }
        );
      }

      res.send(updateResult);
    } catch (error) {
      console.error("Error updating deposit status:", error);
      res.status(500).send({ error: "Failed to update deposit status" });
    }
  });

  return router;
};

module.exports = depositsApi;
