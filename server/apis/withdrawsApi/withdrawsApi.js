const express = require("express");
const { ObjectId } = require("mongodb");

const withdrawsApi = (withdrawsCollection, usersCollection) => {
  const router = express.Router();

  // Add a withdraw request
  router.post("/", async (req, res) => {
    const withdrawInfo = req.body;
    withdrawInfo.status = "pending";
    withdrawInfo.createdAt = new Date();
    // Decrement the user's balance
    await usersCollection.updateOne(
      { _id: new ObjectId(withdrawInfo.userId) },
      { $inc: { balance: -withdrawInfo.amount } }
    );
    const result = await withdrawsCollection.insertOne(withdrawInfo);
    res.send(result);
  });

  // Get all withdraws with user information
  router.get("/", async (req, res) => {
    try {
      const result = await withdrawsCollection
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
      console.error("Error fetching withdraws:", error);
      res.status(500).send({ error: "Failed to fetch withdraws" });
    }
  });

  // Get all withdraws for a specific user
  router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await withdrawsCollection
        .find({ userId: userId })
        .toArray();

      res.send(result);
    } catch (error) {
      console.error("Error fetching user withdraws:", error);
      res.status(500).send({ error: "Failed to fetch user withdraws" });
    }
  });

  router.patch("/status/:id", async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    try {
      const withdraw = await withdrawsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!withdraw) {
        return res.status(404).send({ error: "Withdraw not found" });
      }

      if (withdraw.status !== "pending") {
        return res
          .status(400)
          .send({ error: "Withdraw is not in a pending state" });
      }

      const updateFields = { status };
      if (status === "rejected") {
        updateFields.reason = reason;
      }

      const updateResult = await withdrawsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      // Only increase balance if rejected
      if (status === "rejected") {
        // Refund balance if rejected
        await usersCollection.updateOne(
          { _id: new ObjectId(withdraw.userId) },
          { $inc: { balance: withdraw.amount } }
        );
      } else if (status === "completed") {
        // Track successful withdraws in withdrawBalance
        await usersCollection.updateOne(
          { _id: new ObjectId(withdraw.userId) },
          {
            $inc: {
              withdrawBalance: withdraw.amount, // creates field if not present
            },
          }
        );
      }

      res.send(updateResult);
    } catch (error) {
      console.error("Error updating withdraw status:", error);
      res.status(500).send({ error: "Failed to update withdraw status" });
    }
  });

  return router;
};
module.exports = withdrawsApi;
