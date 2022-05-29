const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send all the dishes to you</h1>");
  })
  .post((req, res, next) => {
    res.end(
      "<h1>Will add the dishes : " +
        req.body.name +
        "with details : " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on dishes");
  })
  .delete((req, res, next) => {
    res.end("Deleting all the dishes");
  });

dishRouter
  .route("/:dishId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send " + req.params.dishId + " to you</h1>");
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on dishes");
  })
  .put((req, res, next) => {
    res.write("Updating the dishes : " + req.params.dishId);
    res.end(
      "<h1>Will update the dish : " +
        req.body.name +
        " with details : " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting all the dishes");
  });

module.exports = dishRouter;
