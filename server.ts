import express from "express";

const app: express.Application = express();

app.get("/", (req, res) => {
  console.log("Hello world..");
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port: ", process.env.PORT || 3000);
});
