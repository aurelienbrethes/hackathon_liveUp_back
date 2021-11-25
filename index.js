const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const port = 9000;

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
  if (req.query.artist_name && req.query.city  && !req.query.date) {
    //filtre les artistes et la ville ca ça marche
    sql += ` WHERE artist_name = ? AND city = ? `; 
    sqlValues.push(req.query.artist_name, req.query.city);
  }
   if (req.query.artist_name && req.query.date && !req.query.city) {
   //filtre les artistes et les dates ca ça marche 
   sql += ` WHERE artist_name = ? and date = ? `;
   sqlValues.push(req.query.artist_name, req.query.date);
 }
 if (req.query.city && req.query.date && ! req.query.artist_name) {
   //filtre la date et la ville ca ça marche
   sql += ` WHERE city = ? AND date = ? `;
   sqlValues.push(req.query.city, req.query.date);
 }
 if (req.query.city && req.query.date && req.query.artist_name) {
   //filtre la date, la ville et l'artiste
   sql += ` WHERE city = ? AND date = ? AND artist_name = ?`;
   sqlValues.push(req.query.city, req.query.date, req.query.artist_name);
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

// STYLES TABLE

// DISPLAY ELEMENTS IN STYLES TABLE

app.get("/styles", (req, res) => {
  connection.query("SELECT * FROM styles ", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

// ADDING ELEMENTS IN STYLES TABLE

app.post("/styles", (req, res) => {
  const { name_style } = req.body;
  connection.query(`INSERT INTO styles (name_style) VALUES (?)`, [name_style], (err) => {
    if(err) {
      res.status(500).send("Error saving the event " + err.message);
    } else {
      const posted = { name_style };
      res.status(201).json(posted);
    }
  })
})

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});
