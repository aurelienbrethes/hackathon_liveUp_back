const express = require("express");
const cors = require("cors");
const connection = require("./db_config");

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json()).use(express.urlencoded({ extended: true }));

connection.connect((err) => {
  if (err) {
    console.log("error connecting " + err.stack);
  } else {
    console.log("connected has id " + connection.threadId);
  }
});

app.get("/events/", (req, res) => {
  connection.query("SELECT * FROM events ", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});
