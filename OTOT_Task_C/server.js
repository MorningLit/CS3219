require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
const posts = [
  {
    name: "bob",
    title: "sunny",
  },
  {
    name: "billy",
    title: "grass",
  },
  {
    name: "admin",
    title: "hello world!",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  if (req.user.name === "admin") return res.json(posts);
  res.json(posts.filter((post) => post.name === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
    if (err || user.name === "guest") return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
