const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promotions = require("../models/promo");
const authenticate = require("../authenticate");
const promotionsRouter = express.Router();
const cors = require("./cors");
promotionsRouter.use(bodyParser.json());

promotionsRouter
  .options(cors.corsOps, (req, res) => (res.sendStatus = 200))
  .route("/")
  .get(cors.cors, (req, res, next) => {
    Promotions.find(req.query)
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
  .post(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .put(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Put operation not supported now on promtions");
    }
  )
  .delete(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  );

promotionsRouter
  .options(cors.corsOps, (req, res) => (res.sendStatus = 200))
  .route("/:promotionsId")
  .get(cors.cors, (req, res, next) => {
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

  .post(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Put operation not supported now on promtions");
    }
  )
  .put(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .delete(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  );

module.exports = promotionsRouter;
