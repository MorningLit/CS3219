require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
const users = [];
let refreshTokens = [];

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});
app.post("/users/login", async (req, res) => {
  const user = users.find((x) => x.name === req.body.name);
  if (user == null) return res.status(400).send("Cannot find user!");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const username = { name: req.body.name };
      const accessToken = generateAccessToken(username);
      const refreshToken = jwt.sign(username, process.env.SECRET_REFRESH_TOKEN);
      refreshTokens.push(refreshToken);
      res
        .json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: "Successfully authenticated!",
        })
        .status(200);
    } else {
      res.status(401).send("Unauthenticated");
    }
  } catch {
    res.status(500).send();
  }
});
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
app.delete("/users/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "15s" });
}

app.listen(4000);
