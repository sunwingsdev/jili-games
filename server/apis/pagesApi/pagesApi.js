const express = require("express");
const { ObjectId } = require("mongodb");

const pagesApi = (pagesCollection) => {
  const router = express.Router();

  // Add a page data
  router.post("/", async (req, res) => {
    const pageInfo = req.body;
    pageInfo.createdAt = new Date();
    const result = await pagesCollection.insertOne(pageInfo);
    res.send(result);
  });

  // Get all page data
  router.get("/", async (req, res) => {
    const result = await pagesCollection.find().toArray();
    res.send(result);
  });

  // update a page
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const pageInfo = req.body;
    pageInfo.modifiedAt = new Date();
    const query = { _id: new ObjectId(id) };
    const updatedDoc = { $set: { ...pageInfo } };
    const result = await pagesCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  // delete a pages
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await pagesCollection.deleteOne(query);
    res.send(result);
  });

  return router;
};

module.exports = pagesApi;
