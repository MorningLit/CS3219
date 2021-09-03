const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");

const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;
const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  redisClient.get(`photos?albumId=${albumId}`, async (err, photos) => {
    if (err) console.error(err);
    if (photos != null) {
      console.log("Cache hit");
      return res.json(JSON.parse(photos));
    } else {
      console.log("Cache miss");
      const { data } = await axios.get(
        "http://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
      );
      redisClient.setex(
        `photos?albumId=${albumId}`,
        DEFAULT_EXPIRATION,
        JSON.stringify(data)
      );
      res.json(data);
    }
  });
});

app.listen(3000);
