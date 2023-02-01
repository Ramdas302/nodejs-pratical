const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8082;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("./app/routes/user")(app);
const db = require("./dbconnection/dbconn");
db.sequelize.sync()
  .then(() => {
    console.log("mysql connected.");
  })
  .catch((err) => {
    console.log("Failed to mysql connection: " + err.message);
  });
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
