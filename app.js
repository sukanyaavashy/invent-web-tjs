const express = require("express");
const app = express();
const connectDB  = require('./database/connection')
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const dotenv = require("dotenv")
dotenv.config()

app.set("view engine", "ejs");

//load assets
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/assets", express.static(__dirname + "public/assets"));

// load assets
app.use('/', require('./routes/router'))

//calling database
connectDB();

app.listen(process.env.PORT, () => console.log("server running..."));




