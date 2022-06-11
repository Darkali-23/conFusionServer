var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var fileStore = require("session-file-store")(session);
var logger = require("morgan");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promotionsRouter");
var leaderRouter = require("./routes/leadersRouter");
const Dishes = require("./models/dishes");
var app = express();

const connect = mongoose.connect("mongodb://localhost:27017/conFusion");
connect.then(
  (db) => {
    console.log("Connected to the server");
  },
  (err) => {
    console.log(err);
  }
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("Badhusha-2312"));
app.use(
  session({
    name: "session-id",
    secret: "badhusha-2312",
    saveUninitialized: false,
    store: new fileStore(),
  })
);
function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("Sorry you are not allowed");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    var username = auth[0];
    var password = auth[1];

    if (username === "admin" && password === "password") {
      req.session.user = "admin";
      next();
    } else {
      var err = new Error("Sorry you are not allowed");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.session.user === "admin") {
      next();
    } else {
      var err = new Error("Sorry you are not allowed");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
  }
}
app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders/", leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
