const express = require("express");
const bodyParser = require("body-parser");

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

promotionsRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send all the promotions to you</h1>");
  })
  .post((req, res, next) => {
    res.end(
      "<h1>Will add the promtions : " +
        req.body.name +
        "with details : " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on promtions");
  })
  .delete((req, res, next) => {
    res.end("Deleting all the promtions");
  });

promotionsRouter
  .route("/:promotionsId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send " + req.params.promotionsId + " to you</h1>");
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on promtions");
  })
  .put((req, res, next) => {
    res.write("Updating the promtions : " + req.params.promotionsId);
    res.end(
      "<h1>Will update the promotions : " +
        req.body.name +
        " with details : " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting: " + req.params.promotionsId);
  });

module.exports = promotionsRouter;
