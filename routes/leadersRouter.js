const express = require("express");
const bodyParser = require("body-parser");

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send all the leaders to you</h1>");
  })
  .post((req, res, next) => {
    res.end(
      "<h1>Will add the leaders : " +
        req.body.name +
        "with details : " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on leaders");
  })
  .delete((req, res, next) => {
    res.end("Deleting all the leaders");
  });

leadersRouter
  .route("/:leadersId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("<h1>Will send " + req.params.leadersId + " to you</h1>");
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported now on leaders");
  })
  .put((req, res, next) => {
    res.write("Updating the leaders : " + req.params.leadersId);
    res.end(
      "<h1>Will update the leaders : " +
        req.body.name +
        " with details : " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting : " + req.params.leadersId);
  });

module.exports = leadersRouter;
