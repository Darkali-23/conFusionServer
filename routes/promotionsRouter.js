const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promotions = require("../models/promo");
const authenticate = require("../authenticate");
const promotionsRouter = express.Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promo) => {
          console.log("Promotion Created ", promo);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => {
        console.log(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on promtions");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.deleteOne({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promotionsRouter
  .route("/:promotionsId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionsId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on promtions");
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionsId, {
      $set: req.body,
    })
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        { new: true },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionsId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = promotionsRouter;
