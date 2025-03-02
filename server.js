const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/save", (req, res) => {
  const data = req.body;
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).send("Error saving data");
    }
    res.send("Data saved successfully");
  });
});

app.post("/saveMembers", (req, res) => {
  const members = req.body.members;
  fs.writeFile("members.json", JSON.stringify(members, null, 2), (err) => {
    if (err) {
      return res.status(500).send("Error saving members");
    }
    res.send("Members saved successfully");
  });
});

app.get("/getMembers", (req, res) => {
  fs.readFile("members.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading members");
    }
    res.send(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
