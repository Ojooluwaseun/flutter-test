const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/error")

//Load env vars
dotenv.config({ path: "./config/config.env" });


const route = require("./route");

const app = express();

//Body Parser
app.use(express.json({ limit: "10kb" })); //Body limit is 10

//Allow CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount Routers
app.use("/", route);

app.use(errorHandler);


//Set security headers to prevent XSS Attack
app.use(helmet());

//Sanitize data to prevent XSS Attack
app.use(xss());

// Rate Limiting (max of 100 request per 10min) to prevent DoS attack
const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 60 * 1000,
});
app.use(limiter);

//Prevent http param polution
app.use(hpp());

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
