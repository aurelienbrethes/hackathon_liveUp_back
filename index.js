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
  let sql = "select * from events";
  const sqlValues = [];
  const arrayLength = Object.keys(req.query).length;
  let properties;
  let values;
  Object.keys(req.query).forEach((key) => {
    properties = key;
    values = req.query[key];
  });
  if (values && arrayLength === 1) {
    // filtre juste les artistes
    sql += ` WHERE ${properties} = ?`;
    sqlValues.push(values);
  }
  if (req.query.artist_name && req.query.city) {
    sql += ` WHERE artist_name = ? AND city = ?`;
    sqlValues.push(req.query.artist_name, req.query.city);
  }
  connection.query(sql, sqlValues, (err, result) => {
    if (err) {
      res
        .status(500)
        .send("Error retrieving data from database " + err.message);
    } else {
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
