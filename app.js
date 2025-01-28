import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dontenv from "dotenv";

// Create an Express application
const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

dontenv.config();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5173", "http://localhost:5174"]
        : ["https://cele.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

//Routes imports
import teamRouter from "./src/routes/teamsRoute.js";
import newsRouter from "./src/routes/newsRoute.js";
import { errorHandler, notFound } from "./src/utils/errors/errorHandler.js";

app.get("/", (req, res) => {
  res.status(200).send("API Works!");
  console.log("This is Home route");
});

// Routes declaration

app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/news", newsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
