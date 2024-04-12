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
  console.log("hello");
  console.log("hello", req.body);
  const { event, build } = req.body;
  console.log("build", build);
  console.log("event", event);

  const status = getStatus(build);

  const body = JSON.stringify({
    context: name ? `UI Tests (${name})` : "UI Tests",
    target_url: build.webUrl,
    ...status,
  });

  console.log("Body:", body);

  res.send(body);
});

api.use("/api/", router);

export const handler = serverless(api);