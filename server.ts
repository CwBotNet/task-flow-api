import express from "express";
import { loadEnvFile } from "node:process";
import { authRouter } from "./routes";
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

    app.use("/api/auth", authRouter);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log("server is running on port: ", PORT);
    });
  } catch (error) {
    console.log("Failed to start server :", error);
  }
};

startServer();
