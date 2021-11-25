const express = require("express");
const cors = require("cors");
const connection = require("./db_config");

const app = express();

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
    console.log("connected has id ");
  }
});

app.get("/events/", (req, res) => {
  console.log(res);
  connection.query("SELECT * FROM events ", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

// app.post("/events/", (req, res) => {
//   const {
//     artist_name,
//     date,
//     time,
//     posta_code,
//     city,
//     place,
//     name_place,
//     styleId,
//   } = req.body;
//   connection.query(
//     `INSERT INTO usersdata (pseudo, mail, password) VALUES (?, ? ,?)`,
//     [pseudo, mail, password],
//     (err) => {
//       if (err) {
//         res.status(500).send("Error saving the movie");
//       } else {
//         const posted = { pseudo, mail, password };
//         res.status(201).json(posted);
//       }
//     }
//   );
// });

app.listen(() => {
  console.log(`App server now listening to port`);
});
