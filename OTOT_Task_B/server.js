const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT, mongoUri } = require("./config");
const cors = require("cors");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/api/Tasks");

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.use("/api/tasks", taskRoutes);
app.get("/", (req, res) => res.send("hello world!"));

app.listen(PORT, () => console.log(`listening on ${PORT}`));
