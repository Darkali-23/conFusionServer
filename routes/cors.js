const express = require("express");
const cors = require("cors");
const app = express();

const whiteList = [
  "http://localhost:3000",
  "https://localhost:3443",
  "http://LAPTOP-S4KC2UBB:3001",
];
var corsOPtionsDelegate = (req, callback) => {
  var corsOptions;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsOps = cors(corsOPtionsDelegate);
