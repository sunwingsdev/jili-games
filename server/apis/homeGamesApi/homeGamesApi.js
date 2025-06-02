const express = require("express");
const { ObjectId } = require("mongodb");

const homeGamesApi = (homeGamesCollection) => {
  const router = express.Router();

  // Add a game
  router.post("/", async (req, res) => {
    const gameInfo = req.body;
    gameInfo.createdAt = new Date();
    const result = await homeGamesCollection.insertOne(gameInfo);
    res.send(result);
  });

  // Get all game data
  router.get("/", async (req, res) => {
    const result = await homeGamesCollection.find().toArray();
    res.send(result);
  });

  // Update a game
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedGame = req.body;
    const result = await homeGamesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedGame }
    );
    res.send(result);
  });

  // Delete a game
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await homeGamesCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  });

  return router;
};

module.exports = homeGamesApi;
