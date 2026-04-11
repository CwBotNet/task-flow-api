import express from "express";
import { loadEnvFile } from "node:process";
import { authRouter, projectRouter } from "./routes";
import { connectDb } from "./db";
import { errorHandler } from "./middleware/error.middleware";

loadEnvFile(".env.local");

const PORT = process.env.PORT;

const app: express.Application = express();

const startServer = async () => {
  try {
    await connectDb();

    app.use(express.json());

    app.get("/", (req, res) => {
      console.log("Hello world..");
      res.send("Hello World!");
    });

    app.get("/api/health", (req, res) => {
      res.status(200).json({ success: true, message: "Server is healthy" });
    });

    // 🚦 ROUTE REGISTRY
    app.use("/api/auth", authRouter);
    app.use("/api/project", projectRouter);

    /**
     * 🛡️ THE GLOBAL SAFETY NET (Error Handler)
     * SENIOR NOTE: This MUST be the very last app.use().
     * Why? Because Express matches routes in order. If an error is thrown in a route,
     * Express looks for the next middleware with 4 arguments (err, req, res, next).
     * If you put this BEFORE your routes, it will never be reached!
     */
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log("server is running on port: ", PORT);
    });
  } catch (error) {
    console.log("Failed to start server :", error);
  }
};

startServer();
