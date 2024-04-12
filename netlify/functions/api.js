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

router.get("/hello", (req, res) => {
  console.log("hello");
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

// const { REST_API, TOKEN } = process.env;

// async function setCommitStatus(build, { repoId, name }) {
//   const status = getStatus(build);

//   const body = JSON.stringify({
//     context: name ? `UI Tests (${name})` : 'UI Tests',
//     target_url: build.webUrl,
//     ...status,
//   });

//   console.log(`POSTING to ${REST_API}repositories/${repoId}/statuses/${build.commit}`);

//   const result = await fetch(`${REST_API}repositories/${repoId}/statuses/${build.commit}`, {
//     method: 'POST',
//     body,
//     headers: { Authorization: `Bearer ${TOKEN}` },
//   });

//   console.log(result);
//   console.log(await result.text());
// }

// const app = express();
// app.use(bodyParser.json());

// app.post("/webhook", async (req, res) => {
//   const status = getStatus(build);

//   const body = JSON.stringify({
//     context: name ? `UI Tests (${name})` : "UI Tests",
//     target_url: build.webUrl,
//     ...status,
//   });

//   console.log("Body:", body);

//   res.send(body);

//   // const { event, build } = req.body;
//   // const { repoId, name } = req.query;

//   // if (!repoId) {
//   //   throw new Error('Need a repoId query param on webhook URL');
//   // }

//   // if (event === 'build-status-changed') {
//   //   await setCommitStatus(build, { repoId, name });
//   // }

//   res.end("OK");
// });

// const { PORT = 3000 } = process.env;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );
