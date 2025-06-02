const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { upload, deleteFile } = require("./utils"); // Import from utils.js

// import API modules
const usersApi = require("./apis/usersApi/usersApi");
const agentsApi = require("./apis/usersApi/agentsApi");
const affiliatesApi = require("./apis/usersApi/affiliateApi");
const depositsApi = require("./apis/depositsApi/depositsApi");
const withdrawsApi = require("./apis/withdrawsApi/withdrawsApi");
const homeControlApi = require("./apis/homeControlApi/homeControlApi");
const categoryApi = require("./apis/categoryApi/categoryApi");
const subCategoryApi = require("./apis/categoryApi/subCategoryApi");
const homeGamesApi = require("./apis/homeGamesApi/homeGamesApi");
const kycApi = require("./apis/kycApi/kycApi");
const promotionApi = require("./apis/promotionApi/promotionApi");
const promotionCategoryApi = require("./apis/promotionApi/promotionCategoryApi");
const pagesApi = require("./apis/pagesApi/pagesApi");
const paymentNumberApi = require("./apis/paymentNumberApi/paymentNumberApi");
const paymentMethodApi = require("./apis/paymentMethodApi/paymentMethodApi");
const withdrawMethodApi = require("./apis/paymentMethodApi/withdrawMethodApi");
const referCodeApi = require("./apis/referCodeApi/referCodeApi");
const commissionApi = require("./apis/commissionApi/commissionApi");

const port = process.env.PORT || 5000;

// CORS configuration
const corsConfig = {
  origin: [
    "https://jstlive.net",
    "http://jstlive.net",
    "https://www.jstlive.net",
    "http://www.jstlive.net",
    "www.jstlive.net",
    "jstlive.net",
    "https://lclb.net",
    "https://www.lclb.net",
    "http://lclb.net",
    "http://www.lclb.net",
    "www.lclb.net",
    "lclb.net",
    "https://bajinew.egamings.live",
    "http://bajinew.egamings.live",
    "https://www.bajinew.egamings.live",
    "http://www.bajinew.egamings.live",
    "www.bajinew.egamings.live",
    "bajinew.egamings.live",
    "https://bajinew.oracleapi.net",
    "http://bajinew.oracleapi.net",
    "https://www.bajinew.oracleapi.net",
    "http://www.bajinew.oracleapi.net",
    "bajinew.oracleapi.net",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://joy9.live",
    "http://joy9.live",
    "joy9.live",
    "https://www.joy9.live",
    "http://www.joy9.live",
    "www.joy9.live",
    // "https://comokbaji.com",
    // "http://comokbaji.com",
    // "www.comokbaji.com",
    // "comokbaji.com",
    // "https://moneyeran365.com",
    // "http://moneyeran365.com",
    // "www.moneyeran365.com",
    // "moneyeran365.com",
    // "https://1xkhela.com",
    // "http://1xkhela.com",
    // "www.1xkhela.com",
    // "1xkhela.com",
    "https://trickbaz.com",
    "http://trickbaz.com",
    "www.trickbaz.com",
    "trickbaz.com",
    // "https://baji.oracletechnology.net",
    // "http://baji.oracletechnology.net",
    // "www.baji.oracletechnology.net",
    // "baji.oracletechnology.net",
    "*",
  ],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middlewares
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

// MongoDB URI and client setup
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Routes for image upload and delete
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/images/${req.file.filename}`,
  });
});

app.delete("/delete", async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "File path not provided" });
  }

  try {
    await deleteFile(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection and API setup
async function run() {
  try {
    await client.connect();

    //Database
    const database = client.db("bajinewv2");

    // Collections
    const usersCollection = database.collection("users");
    const depositsCollection = database.collection("deposits");
    const withdrawsCollection = database.collection("withdraws");
    const homeControlCollection = database.collection("homeControls");
    const categoryCollection = database.collection("categories");
    const subCategoryCollection = database.collection("subCategories");
    const homeGamesCollection = database.collection("homeGames");
    const kycCollection = database.collection("kyc");
    const promotionCollection = database.collection("promotions");
    const promotionCategoryCollection = database.collection(
      "promotion-categories"
    );
    const pagesCollection = database.collection("pages");
    const paymentNumberCollection = database.collection("payment-numbers");
    const paymentMethodCollection = database.collection("payment-methods");
    const withdrawMethodCollection = database.collection("withdraw-methods");
    const referCodesCollection = database.collection("refer-links");
    const commissionsCollection = database.collection("commissions");
    const balanceHistoryCollection = database.collection("balance-histories");

    // API routes
    app.use(
      "/users",
      usersApi(usersCollection, homeControlCollection, balanceHistoryCollection)
    );
    app.use("/users", agentsApi(usersCollection, homeControlCollection));
    app.use("/users", affiliatesApi(usersCollection, homeControlCollection));
    app.use("/deposits", depositsApi(depositsCollection, usersCollection));
    app.use("/withdraws", withdrawsApi(withdrawsCollection, usersCollection));
    app.use("/home-controls", homeControlApi(homeControlCollection));
    app.use(
      "/categories",
      categoryApi(
        categoryCollection,
        subCategoryCollection,
        homeGamesCollection
      )
    );
    app.use(
      "/sub-categories",
      subCategoryApi(subCategoryCollection, homeGamesCollection)
    );
    app.use("/homegames", homeGamesApi(homeGamesCollection));
    app.use("/kyc", kycApi(kycCollection, homeControlCollection));
    app.use("/promotions", promotionApi(promotionCollection));
    app.use(
      "/promotion-categories",
      promotionCategoryApi(promotionCategoryCollection)
    );
    app.use("/pages", pagesApi(pagesCollection));
    app.use("/paymentnumber", paymentNumberApi(paymentNumberCollection));
    app.use("/paymentmethod", paymentMethodApi(paymentMethodCollection));
    app.use("/withdrawmethod", withdrawMethodApi(withdrawMethodCollection));
    app.use("/refer-links", referCodeApi(referCodesCollection));
    app.use("/commissions", commissionApi(commissionsCollection));

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!!!✅");
  } finally {
    // Leave client open for now (close manually if needed)
  }
}
run().catch(console.dir);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is Running.");
});

app.listen(port, () => {
  console.log(`Server is Running on PORT:🆗 ${port}`);
});
