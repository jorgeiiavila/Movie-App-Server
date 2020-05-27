import * as express from "express";
import * as morgan from "morgan";
import { json } from "body-parser";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { Errors } from "./errors/errors";
import { validateUser } from "./middlewares/auth";
import cors from "./middlewares/cors";
import Config from "./config/config";

// Routers
import userRouter from "./routes/user.router";
import filmRouter from "./routes/film.router";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.set("secretKey", Config.jwtSecretKey);
app.use(morgan("dev"));
app.use(json());
app.use(cors);

// Init routes
app.use("/api/user", userRouter);
app.use("/api/film", validateUser, filmRouter);

// Handle 404 error
app.use((req, res, next) => {
  next(Errors.NOT_FOUND());
});

app.use(errorHandler);

app.listen(Config.port, () => {
  console.log(`Server running on port ${Config.port}`);
  mongoose
    .connect(Config.mongoURL + Config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .catch((err) => console.error(err));
});
