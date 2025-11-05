const express = require("express");
const cors = require("cors");

const tables = require("./modules/tables");
const logger = require("./utils/logger");
const app = express();

// Middlewarek

// CORS port:4200
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // req.body-n keresztül átmenjen az adat

app.use("/", tables);

app.listen(3000, () => {
  logger.log("info", "server listening on port 3000");
});
