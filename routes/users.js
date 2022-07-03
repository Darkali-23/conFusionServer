var express = require("express");
var bodyParser = require("body-parser");
var User = require("../models/user");
var router = express.Router();
var passport = require("passport");
var authenticate = require("../authenticate");
var cors = require("./cors");
router.use(bodyParser.json());

/* GET users listing. */
router.options("*", cors.corsOps, (req, res) => {
  res.sendStatus = 200;
});
router.get(
  "/",
  cors.corsOps,
  authenticate.verifyAdmin,
  function (req, res, next) {
    User.find({}).then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ user: user });
    });
  }
);

router.post("/signup", cors.corsOps, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          }
        });
      }
    }
  );
});

router.post("/login", cors.corsOps, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        token: token,
        status: "Login Unsuccessfully!",
        err: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          token: token,
          status: "Login Unsuccessfull !",
          err: "Counldn't Login the user",
        });
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
        token: token,
      });
    });
  })(req, res, next);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});
router.get("/logout", cors.corsOps, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
  }
});

router.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  }
);

router.get("/checkJWTToken", cors.corsOps, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/jsom");
      return res.json({ status: "JWT Invalid", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/jsom");
      return res.json({ status: "JWT Valid", success: true, err: info });
    }
  })(req, res, next);
});

module.exports = router;
