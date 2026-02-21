import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import db from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import { errorMiddleware } from "./middleware/errorMiddlewares.js";
import bookRoutes from "./routes/bookroutes.js";
import borrowRoutes from "./routes/borrowroutes.js";
import userRoutes from "./routes/userroutes.js";
import os from "os";
import { startAccountCleanupJob } from "./services/removeUnverifiedAccounts.js";
import { startNotificationJob } from "./services/notifyUsers.js";

const app = express();

// Middleware configuration
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);
app.use(cookieParser());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
// Test route
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT "Database connection is alive!" AS message'
    );
    res.json({ server: "Running", db_message: rows[0].message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
startAccountCleanupJob();
startNotificationJob();
console.log("⏰ Background automation services started.");
// Error Middleware

app.use(errorMiddleware);

export default app;
