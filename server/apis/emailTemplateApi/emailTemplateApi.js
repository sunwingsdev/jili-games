const express = require("express");
const { ObjectId } = require("mongodb");

const emailTemplateApi = (emailTemplateCollection) => {
  const router = express.Router();

  // Add a new email template
  router.post("/", async (req, res) => {
    try {
      const template = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await emailTemplateCollection.insertOne(template);
      res.status(201).send(result);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).send({ error: "Failed to create email template" });
    }
  });

  // Get all email templates
  router.get("/", async (req, res) => {
    try {
      const templates = await emailTemplateCollection.find().toArray();
      res.send(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).send({ error: "Failed to fetch templates" });
    }
  });

  // Get a single email template by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const template = await emailTemplateCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!template)
        return res.status(404).send({ error: "Template not found" });
      res.send(template);
    } catch (error) {
      res.status(500).send({ error: "Failed to retrieve template" });
    }
  });

  // Update an email template by ID
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const result = await emailTemplateCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.status(200).json({
        message: "Template updated successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        acknowledged: result.acknowledged,
      });
    } catch (error) {
      res.status(500).send({ error: "Failed to update template" });
    }
  });

  // Delete an email template
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const result = await emailTemplateCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.send({
        message: "Template deleted successfully",
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).send({ error: "Failed to delete template" });
    }
  });

  return router;
};

module.exports = emailTemplateApi;
