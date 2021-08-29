require("dotenv").config();
const mongoose = require("mongoose");
const { PORT, mongoUri } = require("./config");
const express = require("express");
const app = express();
const cors = require("cors");
const taskRoutes = require("./routes/api/Tasks");
const path = require("path");

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => console.log(`listening on ${PORT}`));

module.exports = app;
