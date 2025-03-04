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
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
          ]
        : [
            "https://transition-cms-frontend.vercel.app",
            "https://www.transitionventurecapital.com",
            "http://localhost:3000",
            "https://transitionventurecapital.com",
            "https://admin.transitionventurecapital.com",
            "https://cms-admin-2.vercel.app",
            "https://cms-4-one.vercel.app",
            "https://cms-3-git-main-manishgupta-pearlorganis-projects.vercel.app",
            "https://cms-3-ebon.vercel.app",
          ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

//Routes imports
import teamRouter from "./src/routes/teamsRoute.js";
import teamDetailsRouter from "./src/routes/teamDetailsRoute.js";
import focusFeatureRouter from "./src/routes/focusFeaturesRoute.js";
import focusAreaRouter from "./src/routes/focusAreaRoute.js";
import coInvestorRouter from "./src/routes/portfolio/coInvestorRoute.js";
import investmentTimeLineCardRouter from "./src/routes/portfolio/investmentTimelineCardRoute.js";
import portfolioCardRouter from "./src/routes/portfolio/portfolioCardRoute.js";
import investmentTimeLineRouter from "./src/routes/portfolio/investmentTimelineRoute.js";
import portfolioRouter from "./src/routes/portfolio/portfolioRoute.js";
import { errorHandler, notFound } from "./src/utils/errors/errorHandler.js";
import { blogRouter } from "./src/routes/blog.js";
import { impactRouter } from "./src/routes/impactRoutes.js";
import contactUsPageRouter from "./src/routes/page/contactUsPageRoute.js";
import userRouter from "./src/routes/userRoutes.js";
import authRouter from "./src/routes/authRoute.js";

app.get("/", (req, res) => {
  res.status(200).send("API Works!");
  console.log("This is Home route");
});

// Routes declaration
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/team-details", teamDetailsRouter);
app.use("/api/v1/focusarea", focusAreaRouter);
app.use("/api/v1/focus-features", focusFeatureRouter);
app.use("/api/v1/co-investors", coInvestorRouter);
app.use("/api/v1/investment-timeline-cards", investmentTimeLineCardRouter);
app.use("/api/v1/portfolio-cards", portfolioCardRouter);
app.use("/api/v1/investment-timeline", investmentTimeLineRouter);
app.use("/api/v1/portfolio", portfolioRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/impact", impactRouter);
app.use("/api/v1/contact-us-page", contactUsPageRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
