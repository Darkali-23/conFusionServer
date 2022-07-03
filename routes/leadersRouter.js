const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Leaders = require("../models/leader");
const authenticate = require("../authenticate");
const leadersRouter = express.Router();
const cors = require("./cors");
leadersRouter.use(bodyParser.json());

leadersRouter
  .options(cors.corsOps, (req, res) => (res.sendStatus = 200))
  .route("/")
  .get(cors.cors, (req, res, next) => {
    Leaders.find(req.query)
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
  .post(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .put(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Put operation not supported now on leaders");
    }
  )
  .delete(
    cors.corsOps,
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
  .options(cors.corsOps, (req, res) => (res.sendStatus = 200))

  .route("/:leadersId")
  .get(cors.cors, (req, res, next) => {
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
  .post(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Put operation not supported now on leaders");
    }
  )
  .put(
    cors.corsOps,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .delete(
    cors.corsOps,
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
