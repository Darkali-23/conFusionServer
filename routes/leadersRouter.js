const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Leaders = require("../models/leader");
const authenticate = require("../authenticate");
const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (lead) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(lead);
        },
        (err) => next(err)
      )
      .catch((err) => {
        console.log(err);
      });
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then(
        (dish) => {
          console.log("Dish Created ", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on leaders");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.deleteOne({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

leadersRouter
  .route("/:leadersId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leadersId)
      .then(
        (lead) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(lead);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on leaders");
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leadersId, {
      $set: req.body,
    })
      .then(
        (lead) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(lead);
        },
        { new: true },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leadersId)
        .then(
          (lead) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(lead);
          },
          { new: true },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = leadersRouter;
