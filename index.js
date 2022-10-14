import express from "express";
import { printly, colour } from "printly.js";

const app = express();


app.get('/', (req, res) => {
  res.send("FUCK ME i hate typescript..!")
});

app.listen(process.env.PORT, () => {
  printly(colour.greenBright("Fariya is online..!"));
});