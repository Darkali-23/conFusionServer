var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var fileStore = require("session-file-store")(session);
var logger = require("morgan");
const mongoose = require("mongoose");
var passport = require("passport");
var authenticate = require("./authenticate");
var config = require("./config");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promotionsRouter");
var leaderRouter = require("./routes/leadersRouter");
var uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favouriteRouter");
const Dishes = require("./models/dishes");
const commentRouter = require("./routes/commentRouter");
var app = express();

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

const connect = mongoose.connect(config.mongoUrl);
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
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders/", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favourites", favoriteRouter);
app.use("/comments", commentRouter);

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
