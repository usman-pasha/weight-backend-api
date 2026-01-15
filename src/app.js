// Package Imports
import express from "express";
import cors from "cors";

// Custom Imports
import routes from "./routes/index.js";
import globalErrorHandler from "./utils/error/globalError.js";
import {} from "./listeners/index.js";

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

app.use(globalErrorHandler);

export default app;

