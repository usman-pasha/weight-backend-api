// Package Imports
import express from "express";
import cors from "cors";

// Custom Imports
import routes from "./routes/index.js";
import globalErrorHandler from "./utils/error/globalError.js";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const whiteList = ["http://localhost:4200", "http://localhost:8080"];
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || whiteList.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
routes(app);

import responser from "./utils/responser.js";
import catchAsync from "./utils/error/catchError.js";
import logger from "./utils/logger.js";

const getDataApi = async (req, res) => {
  const data = {
    projectName: 'shenton',
    backend: 'nodeJs'
  }
  logger.info(JSON.stringify(data));
  return responser.send(200, "auth", "A_S002", req, res, data);
}

app.get("/", catchAsync(getDataApi))

app.use(globalErrorHandler);

export default app;

