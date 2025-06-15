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

  // Get a single game by id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const game = await homeGamesCollection.findOne({ _id: new ObjectId(id) });
      if (!game) {
        return res
          .status(404)
          .send({ success: false, message: "Game not found" });
      }
      res.send(game);
    } catch (error) {
      console.error("Error fetching game:", error);
      res
        .status(500)
        .send({ success: false, message: "Invalid ID or server error" });
    }
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
