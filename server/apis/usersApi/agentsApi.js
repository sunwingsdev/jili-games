const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const sendEmail = require("../../emailService");

const agentsApi = (usersCollection, homeControlsCollection) => {
  const router = express.Router();
  const jwtSecret = process.env.JWT_SECRET;

  // Middleware to validate JWT tokens
  const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ error: "Access denied. Invalid token format." });

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
  };

  // Register as an agent
  router.post("/agentregistration", async (req, res) => {
    const userInfo = req.body;
    if (!userInfo?.username || !userInfo?.password) {
      return res
        .status(400)
        .send({ message: "Username and password are required" });
    }
    try {
      const existingUser = await usersCollection.findOne({
        username: userInfo?.username,
      });
      if (existingUser)
        return res.status(400).json({ error: "User already exists" });
      const hashedPassword = await bcrypt.hash(userInfo?.password, 10);
      const newUser = {
        ...userInfo,
        password: hashedPassword,
        role: "agent",
        status: "pending",
      };
      newUser.createdAt = new Date();
      const result = await usersCollection.insertOne(newUser);
      // Send Registration Email to the agent
      const emailSubject = "Thanks for Registration";
      const emailText = `Thanks for your registration. Please wait for admin approval. After approval, you will get an confirmation email with further instructions.`;
      await sendEmail(userInfo?.email, emailSubject, emailText);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ message: "Registration failed" });
    }
  });

  // Login a agent and validate JWT issuance
  router.post("/agent/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    try {
      const user = await usersCollection.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ error: "Username or password do not match." });

      if (user?.status?.toLowerCase() !== "approve") {
        return res.status(403).json({
          error:
            "Your account is not approved yet. Please wait for approval or check your email.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Username or password do not match." });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        jwtSecret,
        { expiresIn: "7d" }
      );

      await usersCollection.updateOne(
        { username },
        { $set: { lastLoginAt: new Date() } },
        { upsert: true }
      );

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Login failed." });
    }
  });

  // get all agents
  router.get("/agent", async (req, res) => {
    try {
      const result = await usersCollection
        .find({ role: "agent" }, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch users" });
    }
  });

  // update status of an agent
  router.put("/updateagentstatus/:id", authenticateToken, async (req, res) => {
    const { id } = req.params; // User ID from the URL parameter

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const { status, email } = req.body; // New status from the request body
    if (!id || !status) {
      return res.status(400).json({ error: "User ID and status are required" });
    }

    try {
      const validStatuses = ["approve", "reject", "pending"];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          error: "Invalid status. Use 'approve', 'reject', or 'pending'.",
        });
      }

      const logoData = await homeControlsCollection.findOne({
        page: "home",
        section: "navbar",
        category: "logo",
        isSelected: true,
      });

      if (!logoData || !logoData?.image) {
        return res
          .status(500)
          .json({ error: "Logo not found in the database" });
      }

      const logoUrl = `${process.env.SERVER_URL}${logoData.image}`;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id), role: "agent" },
        { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send email based on the updated status
      let emailSubject = "";
      let emailText = "";

      if (status.toLowerCase() === "approve") {
        emailSubject = "Your Account has been Approved";
        emailText = `<div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #4caf50; text-align: center; padding: 20px;">
        <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
        </div>
        <div style="padding: 20px; color: #333;"
        <h2 style="font-size: 28px; margin-bottom: 10px; font-weight: 700;">Congratulations!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 10px 0;">
        We are pleased to inform you that your application has been successfully approved. Thank you for choosing our services, and we are excited to have you onboard!</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 10px 0;">
        If you have any questions or need further assistance, please feel free to contact us.</p>
        <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.AGENT_LOGIN_LINK}" target="_blank" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: white; background-color: #4caf50; text-decoration: none; border-radius: 5px;">
          Please Login
        </a>
        </div>
        </div>
        
        <div style="text-align: center; padding: 15px; background-color: #f4f4f4; font-size: 14px; color: #777;">
        <p style="margin: 5px 0;">
        Need help? <a href="mailto:support@example.com" style="color: #4caf50; text-decoration: none;">Contact Support</a>
        </p>
        <p style="margin: 5px 0;">© 2025 ${process.env.SITE_NAME}. All rights reserved.</p>
        </div>
        </div>`;
      } else if (status.toLowerCase() === "reject") {
        emailSubject = "Your Account has been Rejected";
        emailText = `
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background-color: #f44336; text-align: center; padding: 20px;">
            <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
          </div>
          <div style="padding: 20px;">
            <p>Unfortunately, your account has been rejected. Please contact our customer support for further assistance.</p>
          </div>
          <div style="text-align: center; margin: 20px;">
            <a href="mailto:support@example.com" style="padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </div>
        </div>
      `;
      }

      if (emailSubject && emailText) {
        await sendEmail(email, emailSubject, emailText);
      }

      res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // get a agent by ID
  router.get("/single-agent/:id", async (req, res) => {
    const { id } = req?.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    if (!id) {
      return;
    }
    const result = await usersCollection.findOne(
      { _id: new ObjectId(id), role: "agent" },
      { projection: { password: 0 } }
    );
    res.send(result);
  });

  // Update an agent by ID
  router.put("/update-agent/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const updateData = req.body;

      // Validate agent ID
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      // Validate update data
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).send({ message: "No data provided to update" });
      }

      // Handle password updates
      if (updateData.password) {
        if (updateData.password.length < 6) {
          return res
            .status(400)
            .send({ message: "Password must be at least 6 characters long" });
        }
        updateData.password = await bcrypt.hash(updateData.password, 10); // Hash password
      }

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updateData };

      const result = await usersCollection.updateOne(filter, updateDoc);

      // Check the result of the update operation
      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Agent not found" });
      }

      if (result.modifiedCount === 0) {
        return res.status(200).send({ message: "No changes were made" });
      }

      res.status(200).send({ message: "Agent updated successfully" });
    } catch (error) {
      console.error("Error updating agent:", error);
      res
        .status(500)
        .send({ message: "Server error. Please try again later." });
    }
  });

  // Admin can log in as any agent using their username
  router.post("/admin/login-as-agent", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: "Agent username is required" });
      }

      // Find the agent by username
      const agent = await usersCollection.findOne({ username: username });
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      if (agent.status.toLowerCase() !== "approve") {
        return res
          .status(403)
          .json({ error: "Agent account is not approved yet." });
      }

      // Generate JWT token for the agent (include role in payload)
      const agentToken = jwt.sign(
        { userId: agent._id, username: agent.username, role: "agent" }, // Include role
        jwtSecret,
        { expiresIn: "1d" }
      );

      // Return the agent's login token with role
      res.status(200).json({
        token: agentToken,
        role: "agent", // Send role separately too
        message: "Admin logged in as agent successfully.",
      });
    } catch (error) {
      res.status(500).json({ error: "Login as agent failed." });
    }
  });

  return router;
};

module.exports = agentsApi;
