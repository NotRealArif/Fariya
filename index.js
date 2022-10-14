import express from "express";
import { printly, colour } from "printly.js";

const app = express();

app.use(express.static('./views'));

app.get('/', async (req, res) => {
  res.status(200)
  .sendFile('/views/index.html')
});

app.ger('/auth/fariya', async (req, res) => {
  res.status(200)
  .sendFile('/views/fariya.html')
});

app.listen(process.env.PORT, () => {
  printly(colour.greenBright("Fariya is online..!"));
});