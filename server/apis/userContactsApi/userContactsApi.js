const express = require("express");
const { ObjectId } = require("mongodb");
const sendEmail = require("../../emailService");

const userContactsApi = (userContactsCollection) => {
  const router = express.Router();

  // Add a new contact
  router.post("/create-contact", async (req, res) => {
    try {
      const contactInfo = req.body;
      contactInfo.date = new Date();
      contactInfo.status = "not-replied";
      const result = await userContactsCollection.insertOne(contactInfo);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to add contact" });
    }
  });

  // Get all contacts
  router.get("/", async (req, res) => {
    try {
      const contacts = await userContactsCollection
        .find()
        .sort({ date: -1 }) // Latest first
        .toArray();
      res.send(contacts);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch contacts" });
    }
  });

  // Get a single contact by ID
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await userContactsCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!contact) return res.status(404).send({ error: "Contact not found" });
      res.send(contact);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch contact" });
    }
  });

  // Send email to user and update status to "replied"
  router.post("/send-email", async (req, res) => {
    try {
      const { to, subject, html, contactId } = req.body;

      if (!to || !subject || !html || !contactId) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      // 1. Send Email
      await sendEmail(to, subject, html);

      // 2. Update contact status to "replied"
      await userContactsCollection.updateOne(
        { _id: new ObjectId(contactId) },
        {
          $set: {
            status: "replied",
            repliedDate: new Date(),
          },
        }
      );

      res.send({ message: "Email sent and status updated successfully" });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).send({ error: "Failed to send email" });
    }
  });

  // Update a contact
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedContact = req.body;
      const result = await userContactsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedContact }
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update contact" });
    }
  });

  // Delete a contact
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userContactsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete contact" });
    }
  });

  return router;
};

module.exports = userContactsApi;
