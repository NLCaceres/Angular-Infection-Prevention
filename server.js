//Install express server
const express = require("express");
const path = require("path");

const app = express();

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
