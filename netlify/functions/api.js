// const express = require("express");
// const bodyParser = require("body-parser");
// const fetch = require("node-fetch");

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();

function getStatus(build) {
  console.log(build);

  switch (build.status) {
    case "FAILED":
      return {
        state: "error",
        description:
          "Build ${build.number} has suffered a system error. Please try again.",
      };

    case "BROKEN":
      return {
        state: "failure",
        description: `Build ${build.number} failed to render.`,
      };
    case "DENIED":
      return {
        state: "failure",
        description: `Build ${build.number} denied.`,
      };
    case "PENDING":
      return {
        state: "pending",
        description: `Build ${build.number} has ${build.changeCount} changes that must be accepted`,
      };
    case "ACCEPTED":
      return {
        state: "success",
        description: `Build ${build.number} accepted.`,
      };
    case "PASSED":
      return {
        state: "success",
        description: `Build ${build.number} passed unchanged.`,
      };
  }

  return {
    context: "UI Tests",
  };
}

router.post("/webhook", (req, res) => {
  console.log("webhook ready");

  let one;
  let two;
  let three;
  let four;

  // console.log("one", req);
  // console.log("one", req);
  // console.log("one", req.body.toString());
  // console.log("two", JSON.parse(req.body.toString()));

  try {
    one = req;
    two = req.body;
    three = req.body.toString();
    four = JSON.parse(req.body.toString());

    console.log("ok", {
      one: one,
      one: two,
      one: three,
      one: four,
    });
  } catch (error) {
    if (one) one = "error";
    if (two) two = "error";
    if (three) three = "error";
    if (four) four = "error";

    console.log("error", one, two, three, four);
  }

  console.log("error", {
    one: one,
    one: two,
    one: three,
    one: four,
  });

  res.send("ok");
});

api.use("/api/", router);

export const handler = serverless(api);