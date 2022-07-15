import express from "express";
import "express-async-errors";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobsRoutes.js";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "Production") {
  app.use(morgan("dev"));
}
app.use(express.json());

// app.get("/api", (req, res) => {
//   res.send({ msg: "Welcome!" });
// });

// app.get("/api/v1", (req, res) => {
//   res.send({ msg: "Welcome!222" });
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5020;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
