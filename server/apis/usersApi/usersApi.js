const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const usersApi = (
  usersCollection,
  homeControlsCollection,
  balanceHistoryCollection
) => {
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

  // Register a new user
  router.post("/register", async (req, res) => {
    const userInfo = req.body;
    // if (!userInfo?.username || !userInfo?.email || !userInfo?.password) {
    //   return res
    //     .status(400)
    //     .json({ error: "Username, Email and password are required" });
    // }
    try {
      const existingUser = await usersCollection.findOne({
        username: userInfo?.username,
      });
      if (existingUser)
        return res.status(400).json({ error: "User already exists" });
      const hashedPassword = await bcrypt.hash(userInfo?.password, 10);
      const newUser = { ...userInfo, password: hashedPassword, role: "user" };
      newUser.createdAt = new Date();
      const result = await usersCollection.insertOne(newUser);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login a user and validate JWT issuance
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    try {
      const user = await usersCollection.findOne({ username });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

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
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Example Protected Route Using Middleware
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const { password: _, ...userInfo } = user;
      res.status(200).json(userInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const result = await usersCollection
        .find({}, { projection: { password: 0 } })
        .toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch users" });
    }
  });

  router.get("/single-user/:id", async (req, res) => {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
      const result = await usersCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
      );

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      res.send(result);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // update status of a user
  router.put("/updateuserstatus/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, email } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    if (!id || !status) {
      return res.status(400).json({ error: "User ID and status are required" });
    }

    try {
      const validStatuses = ["approve", "reject", "pending", "banned"]; // added banned
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          error:
            "Invalid status. Use 'approve', 'reject', 'pending', or 'banned'.",
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
        { _id: new ObjectId(id) },
        { $set: { status: status.toLowerCase(), updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send email based on status
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
      </div>`;
      } else if (status.toLowerCase() === "banned") {
        emailSubject = "Your Account has been Banned";
        emailText = `
      <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #000000; text-align: center; padding: 20px;">
          <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="font-size: 22px; color: #000000; margin-bottom: 10px;">Notice of Ban</h2>
          <p style="font-size: 16px; color: #444;">
            We regret to inform you that your account has been banned due to a violation of our terms and conditions.
            If you believe this is a mistake or wish to appeal, please contact our support team.
          </p>
        </div>
        <div style="text-align: center; margin: 20px;">
          <a href="mailto:support@example.com" style="padding: 10px 20px; background-color: #000000; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
        </div>
      </div>`;
      }

      if (emailSubject && emailText) {
        await sendEmail(email, emailSubject, emailText);
      }

      res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Update an agent by ID
  router.put("/update-user/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const updateData = req.body;

      // Validate agent ID
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
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
        return res.status(404).send({ message: "User not found" });
      }

      if (result.modifiedCount === 0) {
        return res.status(200).send({ message: "No changes were made" });
      }

      res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .send({ message: "Server error. Please try again later." });
    }
  });

  // Update user image by ID
  router.put("/update-user-image/:id", async (req, res) => {
    try {
      const { id } = req.params; // User ID from the URL parameter
      const { profileImage } = req.body; // Image URL or path from the request body

      // Validate the user ID
      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Validate the image field
      if (!profileImage || typeof profileImage !== "string") {
        return res.status(400).json({
          error: "Invalid image value. It must be a non-empty string.",
        });
      }

      // Update the user's image field
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { profileImage } } // Update `image` timestamp
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Profile image updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile image" });
    }
  });

  // Update user's balance by adding new amount
  router.put("/add-balance/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { amountToAdd } = req.body;

    // Validate ID and amount
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (typeof amountToAdd !== "number" || amountToAdd <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedBalance = (user.balance || 0) + amountToAdd;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $inc: {
            balance: amountToAdd,
            depositBalance: amountToAdd,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(500).json({ error: "Failed to update balance" });
      }

      // 🟢 Insert history
      await balanceHistoryCollection.insertOne({
        userId: user._id,
        username: user.username,
        amount: amountToAdd,
        type: "add",
        addedBy: req.user?.username || "Unknown",
        createdAt: new Date(),
      });

      res.status(200).json({
        message: "Balance added successfully",
        newBalance: updatedBalance,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update user's balance by subtract new amount
  router.put("/subtract-balance/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { amountToSubtract } = req.body;

    // Validate ID and amount
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (typeof amountToSubtract !== "number" || amountToSubtract <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.balance < amountToSubtract) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const updatedBalance = user.balance - amountToSubtract;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $inc: {
            balance: -amountToSubtract,
            withdrawBalance: amountToSubtract,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(500).json({ error: "Failed to update balance" });
      }

      await balanceHistoryCollection.insertOne({
        userId: user._id,
        username: user.username,
        amount: amountToSubtract,
        type: "subtract",
        addedBy: req.user?.username || "Unknown",
        createdAt: new Date(),
      });

      res.status(200).json({
        message: "Balance subtracted successfully",
        newBalance: updatedBalance,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get balance history of all users
  router.get("/balance-history", authenticateToken, async (req, res) => {
    try {
      const history = await balanceHistoryCollection
        .find({})
        .sort({ createdAt: -1 }) // latest first
        .toArray();

      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch balance history" });
    }
  });

  return router;
};

module.exports = usersApi;
