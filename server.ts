import express from "express";
import { loadEnvFile } from "node:process";

loadEnvFile(".env.local");

const PORT = process.env.PORT;

const app: express.Application = express();

app.get("/", (req, res) => {
  console.log("Hello world..");
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
});
