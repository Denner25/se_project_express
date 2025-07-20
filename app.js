require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mainRouter = require("./routes/index");
const { handleError } = require("./utils/constants");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(requestLogger); // Log all requests

app.use("/", mainRouter);

app.use(errorLogger); // Log all errors

app.use(errors()); // Celebrate error handler

app.use((err, req, res, next) => {
  console.error(err);
  handleError(res, err);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
