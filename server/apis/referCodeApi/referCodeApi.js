const express = require("express");
const { ObjectId } = require("mongodb");

const refercodeApi = (refersCollection) => {
  const router = express.Router();

  //   add a refer link
  router.post("/generate-referral", async (req, res) => {
    const referInfo = req.body;
    referInfo.createdAt = new Date();
    const result = await refersCollection.insertOne(referInfo);
    res.send(result);
  });

  //   get all refer links
  router.get("/", async (req, res) => {
    try {
      const result = await refersCollection
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

  return router;
};
module.exports = refercodeApi;
