const express = require("express")
const winston = require("winston")

const app = express();

require("./startUp/errLogging")();
require("./startUp/db")();
require("./startUp/routes")(app);

const port = process.env.PORT || 3000

app.listen(port, ()=>{console.log("listening to port "+ port)})