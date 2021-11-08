const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const port = 5000;
const app = express();
const todoRoutes = require("./routes/todos");

const mongoose = require("mongoose");
const { mongoURI } = require("./config");
const uri = `${mongoURI}`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`you are connected listening on port ${port}`);
    });
  })
  .catch(console.error);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/todos', todoRoutes);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    message:
      "You hit the API!",
  });
});

module.exports = app;
