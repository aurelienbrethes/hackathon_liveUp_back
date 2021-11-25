const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const port = 8000;

const app = express();

const corsOptions = {
  origin: true,
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json()).use(express.urlencoded({ extended: true }));

app.get("/events", (req, res) => {
  connection.query("SELECT * FROM events ", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

app.post("/events", (req, res) => {
  const {
    artist_name,
    date,
    time,
    postal_code,
    city,
    location,
    name_place,
    style,
  } = req.body;
  console.log(req.body);
  connection.query(
    `INSERT INTO events (artist_name,
		date,
		time,
		postal_code,
		city,
		location,
		name_place,
		style) VALUES (?, ? ,?, ?, ?, ?, ?, ?)`,
    [artist_name, date, time, postal_code, city, location, name_place, style],
    (err) => {
      if (err) {
        res.status(500).send("Error saving the event " + err.message);
      } else {
        const posted = {
          artist_name,
          date,
          time,
          postal_code,
          city,
          location,
          name_place,
          style,
        };
        res.status(201).json(posted);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});
